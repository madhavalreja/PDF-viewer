import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Document, Page } from 'react-pdf';

const socket = io('http://localhost:5000');

const App = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        socket.on('page-change', (page) => setPageNumber(page));

        const admin = window.confirm("Are you the admin?");
        setIsAdmin(admin);

        return () => socket.off('page-change');
    }, []);

    const changePage = (newPage) => {
        if (isAdmin) {
            setPageNumber(newPage);
            socket.emit('change-page', newPage);
        }
    };

    return (
        <div className="App">
            <h1>PDF Co-Viewer</h1>
            <Document file="your-pdf-file-url.pdf">
                <Page pageNumber={pageNumber} />
            </Document>
            {isAdmin && (
                <div>
                    <button onClick={() => changePage(pageNumber - 1)}>Previous</button>
                    <button onClick={() => changePage(pageNumber + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default App;
