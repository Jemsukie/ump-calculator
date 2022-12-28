import GraphSheet from "../assets/ejs/graph-sheet.ejs";
import SummarySheet from "../assets/ejs/summary-sheet.ejs";
import Template from "../assets/ejs/template.ejs";


import axios from "axios";
import { useEffect, useState } from "react";

const ejs = require('ejs')

const Reader = () => {
  const [templateData, setTemplateData] = useState("");
  const [graphSheetData, setGraphSheetData] = useState("");
  const [summarySheetData, setSummarySheetData] = useState("");
  
  const [downloadLink, setDownloadLink] = useState("");
  const [genLink, setGenLink] = useState(false);

  // Let's get the contents of the files here
  const getFileData = async(file, stateHolder) => {
    return await axios
      .get(file, {
        "Content-Type": "text/plain",
      })
      .then((response) => {
        stateHolder(response.data)
      });
  };

  getFileData(GraphSheet, setGraphSheetData)
  getFileData(SummarySheet, setSummarySheetData)
  getFileData(Template, setTemplateData)

  const renderXml = async (data, input) => {
    const html = await ejs.render(data, input);
    return html;
  };

  

  const getSheetData = async(graphSheetData, summarySheetData) => {
    const graphColData = [{
      month: 'October',
      date: 11,
      earnings: 5350,
      invest: 500,
      excess: 350
    }]
  
    const summaryColData = [{
      amount: 85000,
      date: 'October-04',
      perDay: 850
    }]

    const graphInput = {data: graphColData}
    const graphSheet = await renderXml(graphSheetData, graphInput);
    const summaryInput = {data: summaryColData}
    const summarySheet = await renderXml(summarySheetData, summaryInput);

    return { graphSheet, summarySheet }
  }

  const writeXml = async () => {
    let textFile = null;
    const { graphSheet, summarySheet } = await getSheetData(graphSheetData, summarySheetData)
    let input = { graphSheet, summarySheet }
    const html = await renderXml(templateData, input);
    const data = new Blob([html], {
      type: "text/plain",
    });
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);

    return textFile;
  };

  // const allData = async () => {
  //   let input = { graphSheet: graphSheetData, summarySheet: summarySheetData }
  //   const text = await renderXml(templateData, input);
  //   const parser = new DOMParser();
  //   const serializer = new XMLSerializer()
  //   const xmlDoc = parser.parseFromString(text, "text/xml");
  //   const wb = xmlDoc.querySelector("Workbook") || document.createElement('div');

  //   // console.log(ejsData)

  //   // setEjsData()
  //   const texts = serializer.serializeToString(wb)
  //   console.log(texts);
  // };
  // allData()



  return (
    <section>
      <div className="container">
        {genLink ? (
          <a
            className="btn btn-primary"
            download="info.xml"
            href={downloadLink}
            onClick={(e) => {
              setGenLink(false)
            }}
          >
            Download
          </a>
        ) : (
          <button
            className="btn btn-success"
            onClick={async (e) => {
              e.preventDefault();
              const link = await writeXml();
              setDownloadLink(link);
              setGenLink(true);
            }}
          >
            Generate file
          </button>
        )}
      </div>
    </section>
  );
};

export default Reader;
