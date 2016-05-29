import {
    AfterContentInit,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
} from '@angular/core';

// This is necessary for now because of typing error (bug?)
declare let d3;

@Directive({
    selector: 'myBarChart'
})

export class BarChartDirective implements OnChanges, AfterContentInit {


    // Input and Output variables
    @Input() barChartData;
    @Input() title;
    @Output() hovering = new EventEmitter();

    // Private variables
    private host: any; // d3 element referencing host object
    private svg; // representing the svg
    private margin; // Space between the svg borders and the actual chart\
    private width; // Component width
    private height; // Component height
    private xScale; // Component xScale
    private yScale; // Component yScale
    private xAxis; // Component X Axis
    private yAxis; // Component Y Axis
    private axisConfig; // Configuration for both axes

    // On window resize, redraw the chart
    @HostListener('window:resize', ['$event.target']) onClick() {
        d3.select(this.host).remove();
        this.setup();
        this.buildSVG();
        this.redraw();


    };

    constructor(elementRef: ElementRef) {

        // Select a DOM element
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
    ngOnChanges() {

        // Only render when lineChartData exists
        if (this.barChartData) {
            this.redraw();
        }


    }

    setup(): void {

        // Create SVG geometry
        this.margin = {top: 60, right: 60, bottom: 60, left: 30};
        this.width = document.getElementById('graphArea').clientWidth - this.margin.right - this.margin.left;
        this.height = 800 - this.margin.top - this.margin.bottom;

        // Scales
        this.xScale = d3.scale.ordinal()
            .rangeRoundBands([this.margin.left, this.width - this.margin.right], 0.1, .3);

        this.yScale = d3.scale.linear()
            .range([this.height - this.margin.bottom, this.margin.top]);

        // Axes
        this.xAxis = d3.svg.axis()
            .scale(this.xScale)
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

    }

    buildSVG(): void {

        // Build the SVG container
        this.svg = this.host.append('svg')
            .attr('width', this.width + this.margin.right + this.margin.left)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .attr('class', 'myBarChartGraph')
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top} )`);

    }

    redraw(): void {

        // Push al data into a list for calculating the upper-bound value
        let total_list = [];
        for (let d of this.barChartData) {
            total_list.push(d._value);
        }

        // Setting the domain
        this.xScale.domain(this.barChartData.map((d, i) => d.date));
        this.yScale.domain([0, d3.max(total_list)]);


        // Find al bars and bind them
        let bars = this.svg.selectAll('rect.bar')
            .data(this.barChartData, d => d.date);


        // Remove existing bars not in current binding
        bars.exit()
            .style('opacity', '0.3')
            .style('fill', 'tomato')
            .transition()
            .duration(800)
            .attr('height', 0)
            .attr('y', this.yScale(0)).remove();

        // Update current bars in binding
        bars.transition().duration(1000)
            .attr('x', (d, i) => this.xScale(d.date))
            .attr('width', this.xScale.rangeBand())
            .attr('y', (d) => this.yScale(d._value))
            .attr('height', (d) => this.yScale(0) - this.yScale(d._value));


        // Create new bars in binding
        bars.enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', (d, i) => this.xScale(d.date))
            .attr('width', this.xScale.rangeBand())
            .attr('y', this.yScale(0))
            .attr('height', 0)
            .transition()
            .delay((d, i) => i * 10)
            .duration(300)
            .attr('y', (d) => this.yScale(d._value))
            .attr('height', (d) => this.yScale(0) - this.yScale(d._value));

        // One hover send emit object
        bars.on('mouseover', (d) => {

            this.hovering.emit({newValue: d});

        });

        // Find all circles and bind them to the data
        let circles = this.svg.selectAll('circle.bar')
            .data(this.barChartData, d => d.date);

        // Remove circles which are not bound
        circles.exit()
            .style('opacity', '0.5')
            .style('fill', 'red')
            .transition()
            .delay(1400)
            .duration(500)
            .ease('bounce')
            .attr('cy', this.yScale(0))
            .remove();

        // Update circles which are bound
        circles
            .transition()
            .duration(600)
            .attr('cx', d => this.xScale(d.date) + this.xScale.rangeBand() / 2)
            .attr('cy', d => this.yScale(d._value));


        // Create new circles
        circles.enter().append('circle')
            .classed('bar', true)
            .attr('r', '0')
            .attr('cx', d => this.xScale(d.date) + this.xScale.rangeBand() / 2)
            .attr('cy', this.yScale(0))
            .transition()
            .duration(1000)
            .attr('r', '3')
            .attr('cx', d => this.xScale(d.date) + this.xScale.rangeBand() / 2)
            .attr('cy', d => this.yScale(d._value))
            .style('fill', 'steelblue');

        // Define a line
        let line = d3.svg.line()
            .interpolate('cardinal')
            .x(d => this.xScale(d.date) + this.xScale.rangeBand() / 2)
            .y(d => this.yScale(d._value));

        // Remove current line
        d3.select('path.line').remove();

        // Bind line to data
        let path = this.svg.append('path')
            .datum(this.barChartData)
            .attr('class', 'line')
            .attr('d', line);


        // Animate the line
        let totalLength = path.node().getTotalLength();


        path
            .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .delay(300)
            .duration(800)
            .ease('linear')
            .attr('stroke-dashoffset', 0);

        // Bind axis data to axis
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

        // Rotate text label x-axis
        this.svg.selectAll('.x text')
        // .attr('dy', '.35em')
            .attr('transform', 'translate(-60,60)scale(0.9)rotate(-45)')
            .style('text-anchor', 'start');


        // Append textual items

        // Remove standard text fields
        this.svg.select('.legendArea').remove();

        let legendArea = this.svg.append('g').classed('legendArea', true);

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
            .text('time')
            .style('font-weight', 'bold');

        legendArea.append('text')
            .attr('text-anchor', 'end')
            .attr('transform', `translate(${'40'},${this.margin.top})rotate(-90)`)
            .text('users')
            .style('font-weight', 'bold');

    }

}
