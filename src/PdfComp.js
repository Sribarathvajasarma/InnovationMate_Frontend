import { useState } from "react";
import { Document, Page } from "react-pdf";
import pdf from "./1.pdf";

function PdfComp(props) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="pdf-div" style={{ flex: "1" }}>

            <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page) => {
                        return (
                            <>
                                <p>
                                    Page {page} of {numPages}
                                </p>
                                <Page
                                    pageNumber={page}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </>
                        );
                    })}
            </Document>

        </div>
    );
}
export default PdfComp;