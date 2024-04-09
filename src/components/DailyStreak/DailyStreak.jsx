import bush from "../../assets/bush.png"

function DailyStreak({ dayStreak }){
    return (
        <div className="flex flex-row items-center bg-black rounded-xl p-2">
            <div className="relative flex justify-center items-center">
                <img src={bush} className="w-full h-auto min-w-[80px] max-w-[150px]" />
                <div className="absolute inset-0 flex justify-center items-center">
                    <span className="text-white text-5xl font-extrabold p-2">{dayStreak}</span>
                </div>
            </div>
            <span className="text-white text-3xl font-extrabold p-2 whitespace-nowrap">{` day${dayStreak > 1 ? 's' : ''} streak`}</span>
        </div>
        
      );
};

export default DailyStreak;
