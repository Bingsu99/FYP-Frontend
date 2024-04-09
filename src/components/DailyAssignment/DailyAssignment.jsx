import ProgressBar from "@ramonak/react-progress-bar";
import wateringCan from "../../assets/wateringCan.png"

function DailyAssigment({progress, onClick}){
    return (
        
        <div className="bg-black rounded-xl p-2" onClick={onClick}>
            <div className="flex flex-row">
                <div className="relative flex justify-center items-center">
                    <img src={wateringCan} className="w-full h-auto min-w-[80px] max-w-[150px]" />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-white text-xl font-extrabold p-2 whitespace-nowrap">Daily Challenge</span>
                    {parseInt(progress) < 100 ? <button className="bg-white w-[30%] rounded-md">Start</button> : <span className="text-white text-xl font-extrabold p-2 whitespace-nowrap">Completed</span>}
                    
                </div>
            </div>
            <ProgressBar completed={progress}/>
        </div>
        
      );
};

export default DailyAssigment;
