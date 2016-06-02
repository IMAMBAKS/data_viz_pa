import {Directive, Input, ElementRef} from '@angular/core';


@Directive({
    selector: 'myStackedBarChart'
})


export class StackedBarChartDirective {
    // Input and Output variables
    @Input() stackedChartData;

    // Private variables
    private host: any; // d3 element referencing host object
    // private svg; // representing the svg
    // private margin; // Space between the svg borders and the actual chart\
    // private width; // Component width
    // private height; // Component height
    // private xScale; // Component xScale
    // private yScale; // Component yScale
    // private xAxis; // Component X Axis
    // private yAxis; // Component Y Axis
    // private axisConfig; // Configuration for both axes

    constructor(elementRef: ElementRef) {
        // Select a DOM element
        let htmlElement: any = elementRef.nativeElement;
        this.host = d3.select(htmlElement);
    };
}
