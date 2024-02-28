import React, { useContext, useEffect } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import BasicTable from '../../components/BasicTable/BasicTable';
import { Link, useNavigate } from 'react-router-dom';

// We use useEffect to get Data from DB to replace this mock data
const config ={
  headers: ["Name", "Email", "Password"],
//   items: [['Aing',"Cing@gmail.com","1123"],['Ry',"wd@r.com","gg"], ['Cing',"Bing@gmail.com","1123"],['Ry',"Yd@r.com","gg"]]
  items: [['Aing',"Cing@gmail.com","1123"],['Ry',"wd@r.com","gg"], ['Cing',"Bing@gmail.com","1123"],['Ry',"Yd@r.com","gg"], ['ping',"zing@gmail.com","1123"],['Ry',"wd@r.com","gg"], ['Bing',"Bing@gmail.com","1123"],['Ry',"wd@r.com","gg"], ['Bing',"Bing@gmail.com","1123"],['Ry',"wd@r.com","gg"], ['Bing',"Bing@gmail.com","1123"],['Ry',"wd@r.com","gg"]]
}

function DecksPage() {
    let navigate = useNavigate();
    const { userRole } = useContext(AuthContext);
    const handleRowClick = (rowdata) => {
        navigate(rowdata[0]);
    }
    return(
        <MainLayout user={userRole}>
            <div className="grid grid-rows-12">
                <div className="grid row-span-1 grid-cols-12 gap-3 px-5 items-end">
                    <h2 className="text-3xl col-span-8 font-extrabold text-gray-900 pl-2 pt-5">
                        My Decks
                    </h2>
                   
                </div>
                <div className="row-span-11">
                    <BasicTable headers={config.headers} items={config.items} searchIndex={0} categoriseIndex={2} handleRowClick={handleRowClick}/>
                </div>
                
            </div>
            
        </MainLayout>
    );
}

export default DecksPage;