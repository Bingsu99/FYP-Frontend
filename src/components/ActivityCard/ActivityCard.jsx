import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'flowbite-react';

const customTheme = {
    "root": {
      "base": "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 w-full",
      "children": "flex h-full flex-col justify-center sm:gap-2 gap-4 p-6",
      "horizontal": {
        "off": "flex-col",
        "on": "flex-col w-full flex-row"
      },
      "href": "hover:bg-gray-100 dark:hover:bg-gray-700"
    },
    "img": {
      "base": "",
      "horizontal": {
        "off": "rounded-t-lg",
        "on": "pl-3 object-cover h-auto w-auto rounded-none rounded-l-lg"
      }
    }
}

const ActivityCard = ({activityKey, name, description, icon}) => {
  let navigate = useNavigate();

  function handleOnClick(activityKey){
    navigate('/patient/decks/' + activityKey);
  }
  return (
        <Card
        className="sm:h-[30%] md:h-[20%] w-full"
        imgSrc={icon}
        horizontal
        theme={customTheme}
        onClick={() => handleOnClick(activityKey)}
        >
        <h5 className="sm:text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
        </h5>
        <p className="sm:text-sm md:text-md font-normal text-gray-700 dark:text-gray-400">
            {description}
        </p>
        </Card>
  );
};

export default ActivityCard;
