import {Directive, ElementRef, Input, Output, OnChanges, EventEmitter} from '@angular/core';

declare let d3;

@Directive({
    selector: 'myBarChart'
})

export class BarChartDirective implements OnChanges {

    // Input and Output variables
    @Input() barChartData;
    @Input() title;
    @Output() hovering = new EventEmitter();

    public divs: any;

    render(barChartData: any, title: any) {

        // Resize a function
        let resize = d => {
            this.divs.select('svg').remove();
            console.log('hello1');
            this.render(this.barChartData, this.title);

        };


        d3.select(window).on('resize.one', resize);


        // Cleanup current svg
        this.divs.select('svg').remove();

        // Create window for your chart;
        let margin = {top: 60, right: 60, bottom: 60, left: 30},
            width = document.getElementById('graphArea').clientWidth - margin.right - margin.left,
            height = 400 - margin.top - margin.bottom;

        let svg = this.divs.append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'myBarChartGraph')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Scales
        let x = d3.scale.ordinal()
            .rangeRoundBands([margin.left, width - margin.right], 0.1, .3);

        let y = d3.scale.linear()
            .range([height - margin.bottom, margin.top]);

        // Axes
        let xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickFormat(d3.time.format('%d-%b-%Y'));

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        // Axis data
        let axisData = [
            {axis: xAxis, dx: 0, dy: (height - margin.bottom), clazz: 'x'},
            {axis: yAxis, dx: margin.left, dy: 0, clazz: 'y'}
        ];

        // Re-assign input variable
        let hover = this.hovering;

        // standard graph drawing function
        function redraw(data, _hover) {

            // Push al data into a list for calculating the upper-bound value
            let total_list = [];
            for (let d of data) {
                total_list.push(d._value);
            }

            // Setting the domain
            x.domain(data.map((d, i) => d.date));
            y.domain([0, d3.max(total_list)]);

            // Creating bars
            let bars = svg.selectAll('rect.bar')
                .data(data);

            bars.enter()
                .append('rect')
                .classed('bar', true);

            bars
                .attr('x', (d, i) => x(d.date))
                .attr('width', x.rangeBand())
                .attr('y', y(0))
                .attr('height', 0)
                .transition()
                .delay((d, i) => i * 0)
                .duration(400)
                .attr('y', (d) => y(d._value))
                .attr('height', (d) => y(0) - y(d._value));

            bars
                .on('mouseover', function (d) {

                    _hover.emit({newValue: d});

                });

            // Creating circles
            let circles = svg.selectAll('circle.bar')
                .data(data);

            circles.enter().append('circle');

            circles
                .attr('r', '0')
                .attr('cx', d => x(d.date) + x.rangeBand() / 2)
                .attr('cy', y(0))
                .transition()
                .delay((d, i) => i * 50)
                .duration(400)
                .attr('r', '3')
                .attr('cx', d => x(d.date) + x.rangeBand() / 2)
                .attr('cy', d => y(d._value))
                .style('fill', 'steelblue');

            // Creating a line
            let line = d3.svg.line()
                .interpolate('cardinal')
                .x(d => x(d.date) + x.rangeBand() / 2)
                .y(d => y(d._value));


            let path = svg.append('path')
                .datum(data)
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

            // Create axis
            let axis = svg.selectAll('g.axis')
                .data(axisData);

            axis.enter().append('g')
                .classed('axis', true);

            axis.each(function (d) {
                d3.select(this)
                    .attr('transform', 'translate(' + d.dx + ',' + d.dy + ')')
                    .classed(d.clazz, true)
                    .call(d.axis);
            });

            // Rotate text label x-axis
            svg.selectAll('.x text')
            // .attr('dy', '.35em')
                .attr('transform', 'translate(-60,60)scale(0.9)rotate(-45)')
                .style('text-anchor', 'start');
        }


        // Append textual items
        svg.append('text')
            .attr('x', (width / 3))
            .attr('y', 0 - (margin.top / 3))
            .attr('text-anchor', 'start')
            .text(title)
            .classed('chart-title', true);

        svg.append('text')
            .attr('x', (width / 2))
            .attr('y', height + margin.bottom / 2)
            .attr('text-anchor', 'end')
            .text('time')
            .style('font-weight', 'bold');

        svg.append('text')
            .attr('text-anchor', 'end')
            .attr('transform', `translate(${'40'},${margin.top})rotate(-90)`)
            .text('users')
            .style('font-weight', 'bold');


        redraw(barChartData, hover);


    }

    constructor(elementRef: ElementRef) {

        // Select a DOM element
        let el: any = elementRef.nativeElement;

        this.divs = d3.select(el);

    }


    ngOnChanges() {

        // Only render when barChartData exists
        if (this.barChartData) {
            this.render(this.barChartData, this.title);
        }


    }

}
