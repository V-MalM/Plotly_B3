
function init()
{
 d3.json("samples.json").then (data=> {
    
  console.log(data)
    //Build the drop down
    var Subject_Dropdown = d3.select("#selDataset")    
    var SubjID = data['names']
    for (let i in SubjID)
    {
    sel_option = Subject_Dropdown.append("option").text(SubjID[i])
    sel_option.attr("value", SubjID[i])
    }
    
    // call when selection changes in the multi selection list and the first time page loads
    optionChanged(SubjID[0])

 });
}

 
function optionChanged(Sel_SubjID) {

  d3.json("samples.json").then (data=> {
    
    var metaData = data['metadata']

    let get_sel_samp_record = metaData.filter(sel_sample=>sel_sample.id == Sel_SubjID)[0]
    console.log("this is metedata object", get_sel_samp_record)

    // we will need this variable for gauge
    get_wfreq = get_sel_samp_record['wfreq']

    // call Gauge function
    buildGauge(get_wfreq);
  

    var Subject_Details = d3.select("#sample-metadata") 

    // it clears the contents for the selection
    Subject_Details.html("")

    // Object is the main object that refers to JS Objects.
    // the following line converts this object into an array of arrays. 
    // each property and its value is converted to one inner array 
    // For example, the metadata object
    // {id: 940, ethnicity: "Caucasian", gender: "F", age: 24, location: "Beaufort/NC", bbtype: "I", wfreq: 2}

    // is converted to this array
    // [["id", 940],["ethnicity", "Caucasian"],["gender", "F"],["age", 24]["location", "Beaufort/NC"],["bbtype", "I"],["wfreq", 2]]

    
    let get_sel_samp_record_arr = Object.entries(get_sel_samp_record)
    //console.log("this is metadata arr", get_sel_samp_record_arr)

    get_sel_samp_record_arr.forEach(([key, value])=>{
    Subject_Details.append("p").text(`${key}: ${value}`)
    })

    var Samples = data['samples']
    let get_OTU = Samples.filter(sel_OTU=>sel_OTU.id == Sel_SubjID)[0]

    // console.log("This IS", get_OTU)
    
    // Bar chart to display the top 10 OTUs found in an individual by their ID
    // the data collected from multiple samples for each id is saved in 3 arrays: 
    // 'otu_ids', 'otu_labels', 'sample_values' 
    // To get top 10, we need to sort the data by sample_values in descending order 
    // and then use slice to get top 10
    // To do the sorting , we need to join the values from matching indices of 3 arrays to an array
    // of objects with key value pair properties
    // Then, sort by sample_values and rearrange into arrays using map method and then plot
    // In this case though , the data is already sorted

    get_top_10_OTU_id        = get_OTU['otu_ids'].slice(0,10).reverse()
    get_top_10_OTU_id_lbl    = get_top_10_OTU_id.map(otu_ID => `OTU ${otu_ID}`)
    get_top_10_OTU_labels    = get_OTU['otu_labels'].slice(0,10).reverse()
    get_top_10_sample_values = get_OTU['sample_values'].slice(0,10).reverse()

    var trace1 =
      {

        x: get_top_10_sample_values,
        y: get_top_10_OTU_id_lbl,
        text: get_top_10_OTU_labels,
        type: "bar",
        orientation: "h"
        
      }



    // Data array
    Data = [trace1]

    // console.log(Data)

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot('bar',Data)

    get_OTU_id = get_OTU['otu_ids']
    get_otu_labels = get_OTU['otu_labels']
    get_sample_values = get_OTU['sample_values']

    var trace2 = {
        x: get_OTU_id,
        y: get_sample_values,
        mode: 'markers',
        text: get_otu_labels,
        marker: {
          size : get_sample_values,
          color: get_OTU_id,
          colorscale: "Electric"
        }
      };
      
      var data2 = [trace2];
      
      var layout = {
        showlegend: false,
        height: 500,
        width: 1000
      };
      
      Plotly.newPlot('bubble', data2, layout);

    })
}  

init()


