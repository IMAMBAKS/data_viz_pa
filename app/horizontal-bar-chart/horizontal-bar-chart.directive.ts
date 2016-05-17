import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
    selector: 'myHorizontalBarChart'
})

export class HorizontalBarChartDirective implements OnChanges {

    // data input for my bar chart
    @Input() barChartData;
    @Input() title;
    @Input() xAxis;

    public divs: any;

    render(barChartData: any, title: any, xAxisLabel?: any) {

        // Resize the chart
        let resize = d => {
            this.divs.select('svg').remove();
            console.log('hello2');
            // this.render(this.barChartData, this.title, this.xAxis);

        };

        d3.select(window).on('resize', resize);

        this.divs.select('svg').remove();

        // create window for your chart;
        let margin = {top: 40, right: 60, bottom: 40, left: 150},
            width = document.getElementById('graphArea2').clientWidth - margin.right - margin.left,
            height = 500 - margin.top - margin.bottom;

        let svg = this.divs.append('svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'myHorizontalBarChartGraph')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // scales
        let x = d3.scale.linear()
            .range([0, width - (margin.left + margin.right)]);

        let y = d3.scale.ordinal()
            .rangeRoundBands([height - margin.bottom, margin.top], 0.1, .3);


        // axes
        let xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        let yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        let axisData = [
            {axis: xAxis, dx: margin.left, dy: (height - margin.bottom), clazz: 'x'},
            {axis: yAxis, dx: margin.left, dy: 0, clazz: 'y'}
        ];

        // standard graph drawing function
        function redraw(data) {
            // fill in here

            let total_list = [];
            for (let d of data) {
                total_list.push(+d.value);
            }
            y.domain(data.map((d, i) => d.workspace));
            x.domain([0, d3.max(total_list)]);


            let bars = svg.selectAll('rect.bar')
                .data(data);

            bars.enter()
                .append('rect')
                .classed('bar', true);

            bars
                .attr('y', (d, i) => y(d.workspace))
                .attr('height', y.rangeBand())
                .attr('x', margin.left)
                .attr('width', x(0))
                .transition()
                .delay((d, i) => i * 50)
                .duration(800)
                .attr('width', (d) => {
                    return x(+d.value);
                })
                .style('fill', '#D3D3D3');

            // EXPERIMENTAL CREATE CIRCLE
            let textValues = svg.selectAll('text.bar')
                .data(data);

            textValues.enter().append('text')
                .attr('x', d => x(d.value) + margin.left * 0.85)
                .attr('text-anchor', 'middle')
                .attr('y', d => y(d.workspace) + y.rangeBand() / 2)
                .text(d => d.value)
                .style('fill', 'white');


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


        }


        // Append textual things
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
            .text(xAxisLabel)
            .style('font-weight', 'bold');


        redraw(barChartData);


    }

    constructor(elementRef: ElementRef) {

        let el: any = elementRef.nativeElement;

        this.divs = d3.select(el);

    }


    ngOnChanges() {

        // only render when barChartData exists
        if (this.barChartData) {
            this.render(this.barChartData, this.title, this.xAxis);
        }

    }

}
