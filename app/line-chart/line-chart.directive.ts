/**
 * Created by rimambaks on 5/25/2016.
 */
import {Directive, Input, OnChanges, AfterContentInit} from '@angular/core';

declare let d3;

@Directive({
    'selector': 'myLineChart'
})

export class LineChartDirective implements OnChanges, AfterContentInit {




    // Input and Output variables
    @Input() barChartData;

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
    private line; // Create line definition

    constructor() {
        console.log('Hello Ive been constructed');
    };


    ngAfterContentInit(): any {
        this.setup();
        this.buildSVG();
        this.redraw();
    }


    ngOnChanges(changes: {}): any {
        this.redraw();
    }


    private setup(): void {
        // Create SVG geometry
        this.margin = {top: 60, right: 60, bottom: 60, left: 30};
        this.width = 400 - this.margin.right - this.margin.left;
        this.height = 400 - this.margin.top - this.margin.bottom;

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

        // Create line definition
        this.line = d3.svg.line()
            .interpolate('cardinal')
            .x(d => this.xScale(d.date) + this.xScale.rangeBand() / 2)
            .y(d => this.yScale(d._value));

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

        // Setting Axes domain
        this.xScale.domain(this.barChartData.map((d, i) => d.date));
        this.yScale.domain([0, 300]);

        // Bind line to data
        let path = this.svg.append('path')
            .datum(this.barChartData)
            .attr('class', 'line')
            .attr('d', this.line);


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


        console.log('should be redrawn');
    };

}


