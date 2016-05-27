import {Directive, ElementRef, Input, OnChanges, HostListener, AfterContentInit} from '@angular/core';

@Directive({
    selector: 'myHorizontalBarChart',

})

export class HorizontalBarChartDirective implements OnChanges, AfterContentInit {

    // Data input for my bar chart
    @Input() barChartData;
    @Input() title;
    @Input() xAxisLabel;

    // Variables
    private host: any; // d3 element referencing host object
    private svg; // representing the svg
    private margin; // Space between the svg borders and the actual chart
    private width; // Component width
    private height; // Component height
    private xScale; // Component xScale
    private yScale; // Component yScale
    private xAxis; // Component X Axis
    private yAxis; // Component Y Axis
    private axisConfig; // Configuration for both axes

    // Redraw on window resize
    @HostListener('window:resize', ['$event.target']) onClick() {
        d3.select(this.host).remove();
        this.setup();
        this.buildSVG();
        this.redraw();
    };

    constructor(elementRef: ElementRef) {

        let htmlElement: any = elementRef.nativeElement;

        this.host = d3.select(htmlElement);


    }

    // When content is init, draw the chart
    ngAfterContentInit(): any {
        d3.select(this.host).remove();
        this.setup();
        this.buildSVG();
    }

    // Onchanges redraw the chart
    ngOnChanges(changes) {

        // Only render when lineChartData exists
        if (this.barChartData) {
            this.redraw();
        }

    }

    private setup(): void {

        // Geometry configuration
        this.margin = {top: 40, right: 60, bottom: 40, left: 140};
        this.width = document.getElementById('graphArea2').clientWidth - this.margin.right - this.margin.left;
        this.height = 500 - this.margin.top - this.margin.bottom;

        // Scale configuration
        this.xScale = d3.scale.linear()
            .range([0, this.width - (this.margin.left + this.margin.right)]);

        this.yScale = d3.scale.ordinal()
            .rangeRoundBands([this.height - this.margin.bottom, this.margin.top], 0.1, .3);


        // Axes configuration
        this.xAxis = d3.svg.axis()
            .scale(this.xScale)
            .orient('bottom');

        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient('left');

        this.axisConfig = [
            {axis: this.xAxis, dx: this.margin.left, dy: (this.height - this.margin.bottom), clazz: 'x'},
            {axis: this.yAxis, dx: this.margin.left, dy: 0, clazz: 'y'}
        ];


    }

    private buildSVG(): void {

        // Build the SVG container
        this.svg = this.host.append('svg')
            .attr('width', this.width + this.margin.right + this.margin.left)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'myHorizontalBarChartGraph')
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top} )`);


    }

    private redraw(): void {

        // Transform the data
        let total_list = [];
        for (let d of this.barChartData) {
            total_list.push(+d.value);
        }
        this.yScale.domain(this.barChartData.map((d, i) => d.workspace));
        this.xScale.domain([0, d3.max(total_list)]);


        let bars = this.svg.selectAll('rect.barh')
            .data(this.barChartData, d => d.workspace);

        // Remove all current bars
        bars.exit().transition().duration(1000).style('opacity', '1e-6').remove();

        // Update current bars
        bars
            .transition()
            .delay((d, i) => i * 50)
            .duration(800)
            .attr('y', (d, i) => this.yScale(d.workspace))
            .attr('height', this.yScale.rangeBand())
            .attr('x', this.margin.left)
            .attr('width', (d) => {
                return this.xScale(+d.value);
            })
            .style('fill', '#D3D3D3');

        // Create new bars
        bars.enter()
            .append('rect')
            .classed('barh', true)
            .style('fill', '#D3D3D3')
            .attr('y', (d, i) => this.yScale(d.workspace))
            .attr('height', this.yScale.rangeBand())
            .attr('x', this.margin.left)
            .attr('width', this.xScale(0))
            .transition()
            .delay((d, i) => i * 50)
            .duration(800)
            .attr('width', (d) => {
                return this.xScale(+d.value);
            });

        // Remove current text values
        this.svg.selectAll('text.barh').remove();

        // Push text values onto the chart
        let textValues = this.svg.selectAll('text.barh')
            .data(this.barChartData);


        textValues.enter().append('text')
            .attr('x', d => this.xScale(d.value) + this.margin.left * 0.85)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .attr('y', d => this.yScale(d.workspace) + this.yScale.rangeBand() / 2)
            .text(d => d.value)
            .classed('barh', 'true')
            .style('opacity', '0')
            .transition()
            .delay(800)
            .style('opacity', '1');


        // Create Axes into the chart
        let axis = this.svg.selectAll('g.axis')
            .data(this.axisConfig);

        axis.enter().append('g')
            .classed('axis', true);

        axis.transition().duration(1000).each(function (d) {
            d3.select(this)
                .attr('transform', 'translate(' + d.dx + ',' + d.dy + ')')
                .classed(d.clazz, true)
                .call(d.axis);
        });

        // Remove standard text fields
        this.svg.select('.legendArea').remove();

        let legendArea = this.svg.append('g').classed('legendArea', true);

        // Build standard text fields
        legendArea.append('text')
            .attr('x', (this.width / 3))
            .attr('y', 0 - (this.margin.top / 3))
            .attr('text-anchor', 'start')
            .text(this.title)
            .classed('chart-title', true);

        legendArea.append('text')
            .attr('x', (this.width / 2))
            .attr('y', this.height + this.margin.bottom / 2)
            .attr('text-anchor', 'end')
            .text(this.xAxisLabel)
            .style('font-weight', 'bold');

    }
}
