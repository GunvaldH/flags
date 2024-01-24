'use client'
import {useState, useEffect} from 'react';

const urlbase = "https://flagcdn.com/"

type FlagType = {
    url: string
    countrycode: string
    name: string
}

type QuizSet = {
    quizFlags: FlagType[],
    quizPos: number
}



const Quiz = () => {

    const [currentFlag, setCurrentFlag] = useState<FlagType>();
    const [currentQuiz, setCurrentQuiz] = useState<QuizSet>();
    const [reveal, setReveal] = useState<boolean>(false);
    const [answerIx, setAnswerIx] = useState<number>(-1);

    const [countrycodes, setcountrycodes] = useState(null);
    const [flags, setflags] = useState<FlagType[]>([]);

    useEffect(() => {
        fetch("https://flagcdn.com/no/codes.json")
        .then(res => res.json())
        .then((res:any) => {setcountrycodes(res); setflags(getNoUSStatesFlagList(res))} )
        
    }, []
    )

    const getNoUSStatesFlagList = (cc: object):FlagType[] => {
        if (cc === undefined)
            return [];
        else
        {
                var ret: FlagType[] = [];
                var i:number = 0;
                for (const [key, value] of Object.entries(cc)) 
                {
                    if (!key.startsWith("us-")) 
                        ret[i++] = {url: urlbase + key + ".svg", countrycode: key, name: value.toUpperCase()};
                    
                }
                return ret;
        }
    }


    const drawRandomIx = (numberOfFlags: number): number => {
        return Math.random()*numberOfFlags;
    } 
    const selectNextQuiz= ():void => {
        const newIxNumber = drawRandomIx(flags.length);
        const newIx = Math.floor(newIxNumber);
        var newIx2:number =0;
        var finished:boolean = false;
        while (!finished) {
            newIx2 = Math.floor(drawRandomIx(flags.length))
            if (newIx2 !== newIx) finished=true;
        }
        finished=false;
        var newIx3: number = 0;
        //const newIx2 = Math.floor(drawRandomIx(flags.length));
        while (!finished) {
            newIx3 = Math.floor(drawRandomIx(flags.length))
            if ((newIx3 !== newIx) && (newIx3 !== newIx2))  finished=true;
        }
        
        //const newIx3 = Math.floor(drawRandomIx(flags.length));
        const correctPos = Math.floor(drawRandomIx(3));
        
        const correctFlag:FlagType = flags[newIx];
        const wrongFlag2:FlagType = flags[newIx2];
        const wrongFlag3:FlagType = flags[newIx3];

        const nextQuiz:QuizSet = {quizFlags: [correctFlag, wrongFlag2, wrongFlag3], quizPos: correctPos};
        setReveal(false);
        setAnswerIx(-1);
        setCurrentQuiz(nextQuiz);

        const a = correctFlag;
        setCurrentFlag(correctFlag);
    }

    const onAnswerQuiz = (answerIx: number) => {
        if (!reveal){
            setReveal(true);
            setAnswerIx(answerIx);
        }
    }

    const presentFlag = (quiz: QuizSet|undefined) => {
        const correctFlag = quiz?.quizFlags[quiz.quizPos]??undefined;

        return <div className="w-80 p-2 m-2 font-light flex flex-col items-center" key={correctFlag?.url}>
                    <div className="bg-slate-50">
                        <img className= "shadow-2xl" src={correctFlag?.url} width="300" height="250" alt="???????"/>
                    </div>
                </div>
    }

    const presentAlternatives = (quiz: QuizSet|undefined) => {
        const classN = "display-inline my-2 px-4 border text-wrap cursor-pointer";
        //const classCorr = "my-1 px-2 text-wrap bg-green-500 cursor-pointer";
        const ix = quiz?.quizPos;

        var lineTp: string[] = ["my-2 px-4 text-wrap cursor-pointer", "my-2 px-4 text-wrap cursor-pointer", "my-2 px-4 text-wrap cursor-pointer"]
        if (answerIx === ix)
            lineTp[ix] = "my-2 px-4 text-wrap bg-green-500 cursor-pointer"
        else
        {
            (ix!== undefined) && (lineTp[ix] = "my-2 px-4 text-wrap bg-green-300 cursor-pointer");
            (answerIx !== -1) && (lineTp[answerIx] = "my-2 px-4 text-wrap bg-red-600 cursor-pointer")
        }

        return (
            <>
                <div onClick={() => onAnswerQuiz(0)} className={(reveal? lineTp[0]:classN)}>- {quiz?.quizFlags[0].name}</div>
                <div onClick={() => onAnswerQuiz(1)} className={(reveal? lineTp[1]:classN)}>- {quiz?.quizFlags[1].name}</div>
                <div onClick={() => onAnswerQuiz(2)} className={(reveal? lineTp[2]:classN)}>- {quiz?.quizFlags[2].name}</div>
            </>
        )
    }

    
    return (
        <div className="p-2 bg-white text-black" >
            <div className="mx-auto w-80">
                <div className="flex flex-col justify-items-center place-items-stretch">
                {(currentQuiz) && presentFlag(currentQuiz)}
                    <div className="mx-4 my-2">Velg alternativ:</div>
                    {(currentQuiz) && presentAlternatives(currentQuiz)}
                    <button className="m-3 bg-blue-500 hover:bg-blue-700  text-white py-2 px-4 rounded" 
                        onClick={selectNextQuiz}>{(currentQuiz)?"Neste":"Sett i gang"} </button>
                </div>
            </div>
        </div>
    )
}

export default Quiz