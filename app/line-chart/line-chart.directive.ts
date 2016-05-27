/**
 * Created by rimambaks on 5/25/2016.
 */
import {Directive, Input, OnChanges, AfterContentInit, ElementRef} from '@angular/core';

declare let d3;

@Directive({
    'selector': 'myLineChart'
})

export class LineChartDirective implements OnChanges, AfterContentInit {




    // Input and Output variables
    @Input() lineChartData;

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
    // private line; // Create line definition

    constructor(elementRef: ElementRef) {
        // Select a DOM element
        let htmlElement: any = elementRef.nativeElement;
        this.host = d3.select(htmlElement);
    };


    ngAfterContentInit(): any {
        this.setup();
        this.buildSVG();

    }


    ngOnChanges(changes: {}): any {
        // Only render when lineChartData exists
        if (this.lineChartData) {
            this.redraw();
        }
    }


    private setup(): void {



        // Create SVG geometry
        this.margin = {top: 60, right: 60, bottom: 60, left: 30};
        this.width = 1200 - this.margin.right - this.margin.left;
        this.height = 400 - this.margin.top - this.margin.bottom;

        // Scales
        this.xScale = d3.time.scale()
            .range([this.margin.left, this.width - this.margin.right]);

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

        // // Create line definition
        // this.line = d3.svg.line()
        //     .interpolate('cardinal')
        //     .x(d => this.xScale(d.values.date) + this.xScale.rangeBand() / 2)
        //     .y(d => this.yScale(d.values.value));

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
        let timeFormat2 = d3.time.format('%Y-%m-%d');
        this.xScale.domain([timeFormat2.parse('2013-03-01'), timeFormat2.parse('2016-04-01')]);
        this.yScale.domain([0, 241]);

        let pointLine = d3.svg.line()
            .interpolate('basis')
            .x(d => this.xScale(new Date(+d.date)))
            .y(d => this.yScale(d.value));


        // Define lines
        let lines = this.svg.selectAll('.line-graph')
            .data(this.lineChartData);

        // Bind the data)
        lines.enter()
            .append('g')
            .attr('class', 'line-graph');

        let path = lines.append('path')
            .datum(d => d.values)
            .attr('d', (d) => {
                    return pointLine(d);
                }
            );

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


        //
        // Animate the line
        for (let i = 0; i < this.lineChartData.length; i++) {
            let totalLength = path[0][i].getTotalLength();
            console.log('totalLenght is ', totalLength);
            d3.select(path[0][i])
                .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(10000)
                .ease('linear')
                .attr('stroke-dashoffset', 0);
        }


        console.log(this.lineChartData.length);

        // path.transition().duration(1).each(function (d) {
        //
        //     d3.select(this)
        //         .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        //         .attr('stroke-dashoffset', totalLength)
        //         .transition()
        //         .delay(300)
        //         .duration(800)
        //         .ease('linear')
        //         .attr('stroke-dashoffset', 0);
        //
        //
        // });


        console.log('should be redrawn');
    };

}


