//Define url variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//Fetch the JSON data
let data = d3.json(url).then(function (data) {
    console.log(data);
});

//Create a horizontal bar chart with a dropdown menu to 
//display the top 10 OTUs found in that individual.
function buildBarPlot(sampleID) {
    d3.json(url).then(function (data) {
        let samples = data.samples;

        //Filter data to get values for each sample
        let sampleArray = samples.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];

        //Assign variables to sample values
        let otu_ids = sample.otu_ids
        let sample_values = sample.sample_values
        let otu_labels = sample.otu_labels

        //Set variable for plot values
        let trace1 = [
            {
                x: sample_values.slice(0, 10).reverse(),
                y: otu_ids.slice(0, 10).map(otu_id => "OTU " + otu_id).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        //Define layout
        let layout = {
            title: "top 10 OTUs "
        };

        //Call Plotly to plot 
        Plotly.newPlot("bar", trace1, layout)

    });

};

//Create a bubble chart that displays each sample.
function buildBubblePlot(sampleID) {
    d3.json(url).then(function (data) {
        let samples = data.samples;

        //Filter data to get values for each sample
        let sampleArray = samples.filter(x => x.id == sampleID);
        let sample = sampleArray[0];

        //Assign variables to sample values
        let otu_ids = sample.otu_ids
        let sample_values = sample.sample_values
        let otu_labels = sample.otu_labels

        //Set variable for plot values
        let trace2 = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }

            }];
        //Define layout
        let layout = {
            xaxis: { title: "OTU ID" }
        };
        //Call Plotly to plot
        Plotly.newPlot("bubble", trace2, layout)

    });
};

//Display the sample metadata
function buildPanel(sampleID) {
    let data = d3.json(url).then(function (data) {
        let samples = data.metadata;
        let sampleArray = samples.filter(sample => sample.id == sampleID);
        let sample = sampleArray[0];
        console.log(sample);
        let panel = d3.select("#sample-metadata");
        panel.html("");
        for (key in sample) {
            panel.append("h6").text(key.toUpperCase()+": "+sample[key])
        }
    });
}


//Display each key-value pair from the metadata JSON object

function init() {
    let data = d3.json(url).then(function (data) {
        console.log(data);
        let names = data.names;
        let dropdownMenu = d3.select("#selDataset");
        for (let i = 0; i < names.length; i++) {
            dropdownMenu.append("option").text(names[i]).property("value", names[i]);

        }
        buildBarPlot(names[0]);
        buildBubblePlot(names[0]);
        buildPanel(names[0]);
        //metadata pass value
    });

}
function optionChanged(x) {
    buildBarPlot(x);
    buildBubblePlot(x);
    buildPanel(x);
}


init();