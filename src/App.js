import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { pdfjs } from "react-pdf";
import { Button, Typography, Container, Tabs, Tab, AppBar, Toolbar, Avatar } from "@material-ui/core";
import PdfComp from "./PdfComp";
import MindMap from "./MindMap.js";
import WhiteBoard from "./Whiteboard.js"


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();



const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Poppins"
  },
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 300,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "3em 3em 0 3em",
  },
  mainContainer: {
    // backgroundImage: `url(${image})`,
    // backgroundImage: `url(${image2})`,
    // backgroundRepeat: 'no-repeat',
    // backgroundPosition: 'center',
    // backgroundSize: 'cover',
    backgroundColor: 'white',
    height: "100%",
    marginTop: "8px",
    fontFamily: "verdana"
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 300,
    backgroundColor: '#008000',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "600px",
    width: "100%",
    marginBottom: "25px"
  },
  detail: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: '#2337C6',
    boxShadow: 'none',
    color: 'white',
  },
  footer: {
    backgroundColor: '#193a1e',
    marginTop: 'auto',
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  stepper: {
    background: 'transparent',
  },
  step: {
    '& .MuiStepIcon-active': {
      color: 'green', // Change the color of the step icons to green
    },
    '& .MuiStepIcon-completed': {
      color: 'green', // Change the color of the step icons to green
    },
  },

  loader: {
    color: '#be6a77 !important',
  },


  logo: {
    marginLeft: theme.spacing(2), // Add spacing between logo and tabs
  },

  dropZone: {
    height: "315px",

  },

  dropZoneText: {
    "color": '#008000',
    "font-family": "Poppins",
    "font-style": "normal"
  },
  content: {
    margin: "auto"
  }

}));



function App() {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isExtracWordSelected, setIsExtracWordSelected] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);




  useEffect(() => {
    getPdf();
  }, []);

  const handleTextSelect = () => {
    const selectedText = window.getSelection().toString();
    console.log(selectedText);
  };


  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files/");
    console.log(result.data)
    setAllImage(result.data);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const result = await axios.post(
      "http://localhost:5000/upload-files/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (result.data.status === "ok") {
      alert("Uploaded Successfully!!!");
      getPdf();
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}/`);


  };

  const ExtractWords = async () => {

    const jsonObject = { text: pdfFile };
    const jsonString = JSON.stringify(jsonObject);
    const response = await axios.post('http://localhost:5000/extract_words/', jsonString, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data.extracted_text); // Log the response from the server
    setExtractedText(response.data.extracted_text)
    setIsExtracWordSelected(true)
  }

  const handleTranslate = async () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const jsonObject = { text: selectedText };
      const jsonString = JSON.stringify(jsonObject);
      const response = await axios.post('http://localhost:5000/translate/', jsonString, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTranslatedText(response.data.translation)

      console.log(response.data.translation); // Log the response from the server
    } else {
      alert("Please select text to translate")
    }

  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap href="#" sx={{ flexGrow: 1 }}>
            AgrOM : A Hybrid System
          </Typography>
          <div className={classes.grow} />
          <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Home" />
            <Tab label="Predict" />
            <Tab label="MindMap" />
            <Tab label="Whiteboard" />

            {/* Add more tabs as needed */}
          </Tabs>
          {/* <Avatar src={logo} className={classes.logo}></Avatar> */}
        </Toolbar>
      </AppBar>
      {selectedTab === 1 && <Container maxWidth="sm">

        <form onSubmit={submitImage}>
          <Typography variant="h4">Upload Pdf in React</Typography>

          <br />
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
        <div className="uploaded">
          <Typography variant="h4">Uploaded PDF:</Typography>
          <div className="output-div">
            {allImage &&
              allImage.map((data) => (
                <div className="inner-div" key={data._id}>
                  <Typography variant="h6">Title: {data.title}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => showPdf(data.pdf)}
                  >
                    Show Pdf
                  </Button>
                </div>
              ))}
          </div>
        </div>
        <br />
        <Button variant="contained" color="primary" style={{ marginRight: "5px" }} onClick={() => ExtractWords()}>
          Extract words
        </Button>
        <Button variant="contained" color="primary" style={{ marginRight: "5px" }} onClick={() => handleTextSelect()}>
          Select word
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleTranslate()}>
          Translate
        </Button>
        <Typography variant="h6">Translation</Typography>

        <Typography variant="h6">{translatedText}</Typography>

        <div style={{ display: "flex", flex: "1" }}>
          <PdfComp pdfFile={pdfFile} />
          {isExtracWordSelected && (
            <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
              <Typography variant="h5">Extracted words</Typography>
              <div>{extractedText}</div>
            </div>
          )}
        </div>

      </Container>}
      {
        selectedTab === 2 && <MindMap />
      }
      {
        selectedTab === 3 && <WhiteBoard />
      }
    </React.Fragment>
  );
}

export default App;