import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout";
import AuthContext from '../../context/AuthContext';
import BasicTable from '../../components/BasicTable/BasicTable';
import DeckModal from '../../containers/DeckModal (Template)/DeckModal';
import CompleteSentenceModal from '../../containers/CompleteSentenceModal/CompleteSentenceModal';

const config ={
    headers: ["Name", "Email", "Password"],
    items: [['Ry',"wd@r.com","gg"], ['Bing',"Bing@gmail.com","1123"],['Ry',"wd@r.com","gg"], ['Bing',"Bing@gmail.com","1123"],['Ry',"wd@r.com","gg"]]
  }

function DeckPage() {
    const { userRole } = useContext(AuthContext); 
    let { deckID } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const handleRowClick = (rowData) => {
        setSelectedRowData(rowData);
        setOpenModal(true);
    };

    return(
        <MainLayout user={userRole}>
            <div className="grid grid-rows-12">
                <div className="grid row-span-1 grid-cols-12 gap-3 px-5 items-end">
                    <h2 className="text-3xl col-span-8 font-extrabold text-gray-900 pl-2 pt-5">
                        {deckID}
                    </h2>
                </div>
                <div className="row-span-11">
                    <BasicTable headers={config.headers} items={config.items} searchIndex={0} categoriseIndex={2} handleRowClick={handleRowClick}/>
                </div>
            </div>
            <CompleteSentenceModal isOpen={openModal} onClose={() => setOpenModal(false)} rowData={selectedRowData} />
        </MainLayout>
    );
}

export default DeckPage;
