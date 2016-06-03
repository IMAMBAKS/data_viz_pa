import {Directive, Input, ElementRef, OnChanges, AfterContentInit} from '@angular/core';
declare let d3;

@Directive({
    selector: 'myStackedBarChart'
})


export class StackedBarChartDirective implements OnChanges, AfterContentInit {


    // Input and Output variables
    @Input() stackedChartData;

    // Private variables
    private host: any; // d3 element referencing host object
    private svg; // representing the svg
    private margin; // Space between the svg borders and the actual chart\
    private width; // Component width
    private height; // Component height
    private xScale0; // Component xScale
    private xScale1; // Component xScale
    private yScale; // Component yScale
    private xAxis; // Component X Axis
    private yAxis; // Component Y Axis
    private axisConfig; // Configuration for both axes

    constructor(elementRef: ElementRef) {
        // Select a DOM element
        let htmlElement: any = elementRef.nativeElement;
        this.host = d3.select(htmlElement);
    };

    ngOnChanges(changes: {}): any {
        // Only draw when there is data
        if (this.stackedChartData) {
            this.redraw();
        }
    }

    ngAfterContentInit(): any {
        this.setup();
        this.buildSVG();
    }

    private setup(): void {



        // Create SVG geometry
        this.margin = {top: 60, right: 60, bottom: 60, left: 70};
        this.width = document.getElementById('graphArea').clientWidth - this.margin.right - this.margin.left;
        this.height = 800 - this.margin.top - this.margin.bottom;

        // Scales
        this.xScale0 = d3.scale.ordinal().rangeRoundBands([this.margin.left, this.width - this.margin.right], 0.1, .3);

        this.xScale1 = d3.scale.ordinal();

        this.yScale = d3.scale.linear()
            .range([this.height - this.margin.bottom, this.margin.top]);

        // Axes
        this.xAxis = d3.svg.axis()
            .scale(this.xScale0)
            .orient('bottom')
            .tickFormat(d3.time.format('%d-%b-%Y'));


        this.yAxis = d3.svg.axis()
            .scale(this.yScale)
            .orient('left');

        // Axis config
        this.axisConfig = [
            {axis: this.xAxis, dx: 0, dy: (this.height - this.margin.bottom), clazz: 'x'},
            {axis: this.yAxis, dx: this.margin.left, dy: 0, clazz: 'y'}
        ];


    };

    private buildSVG(): void {

        // Build the SVG container
        this.svg = this.host.append('svg')
            .attr('width', this.width + this.margin.right + this.margin.left)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'myLineChart')
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top} )`);

    };

    private redraw(): void {

        // Set scales
        let scopeNames = d3.keys(this.stackedChartData[0]).filter(key => key !== 'date');
        let color = d3.scale.category20();
        console.log(scopeNames);

        this.xScale0.domain(this.stackedChartData.map(function (d) {
            return new Date(+d.date);
        }));
        this.xScale1.domain([0, 1]).rangeRoundBands([0, this.xScale0.rangeBand()]);
        this.yScale.domain([0, d3.max(this.stackedChartData, d => +d.intern)]);

        let state = this.svg.selectAll('.state')
            .data(this.stackedChartData)
            .enter().append('g')
            .attr('class', 'state')
            .attr('transform', d => `translate(${this.xScale0(new Date(+d.date))},0)`);

        state.selectAll('rect')
            .data((function (d) {
                    return [+d.extern, +d.intern];
                }
            ))
            .enter().append('rect')
            .attr('width', this.xScale1.rangeBand())
            .attr('height', (d, i) => this.yScale(0) - this.yScale(d))
            .attr('x', (d, i) => this.xScale1(i))
            .attr('y', (d, i) => this.yScale(+d))
            .style('fill', (d, i) => color((i * 2).toString()));


        // Bind axis data to axis
        let axis = this.svg.selectAll('g.axis')
            .data(this.axisConfig);

        axis.enter().append('g')
            .classed('axis', true);

        axis.transition().duration(300).each(function (d) {
            d3.select(this)
                .attr('transform', 'translate(' + d.dx + ',' + d.dy + ')')
                .classed(d.clazz, true)
                .call(d.axis);
        });

        // Create legend
        let legend = this.svg.selectAll('.legend')
            .data(scopeNames)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => (`translate(0, ${i * 20})`));

        legend.append('rect')
            .attr('x', this.margin.left + 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', (d, i) => color((i * 2).toString()));

        legend.append('text')
            .attr('x', this.margin.left + 40)
            .attr('y', 9)
            .attr('dy', '.35em')
            .attr('text-anchor', 'left')
            .text((d, i) => scopeNames[i]);


    }
}
