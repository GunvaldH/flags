'use client'
import {useState, useEffect} from 'react';

const urlbase = "https://flagcdn.com/"

type FlagType = {
    url: string
    countrycode: string
    name: string
}

type FlagTypeExt = {
    url: string
    countrycode: string
    name: string,
    ix: number
}

type QuizSet = {
    quizFlags: FlagTypeExt[],
    quizPos: number
}

type QuizResult = {
    flagIndex: number,
    answer: boolean
}



const Quiz = () => {

    const [currentFlag, setCurrentFlag] = useState<FlagType>();
    const [currentQuiz, setCurrentQuiz] = useState<QuizSet>();
    const [reveal, setReveal] = useState<boolean>(false);
    const [answerIx, setAnswerIx] = useState<number>(-1);
    const [results, setResults] = useState<QuizResult[]>([]);

    const [countrycodes, setcountrycodes] = useState(null);
    const [flags, setflags] = useState<FlagTypeExt[]>([]);

    useEffect(() => {
        fetch("https://flagcdn.com/no/codes.json")
        .then(res => res.json())
        .then((res:any) => {setcountrycodes(res); setflags(getNoUSStatesFlagList(res))} )
        
    }, []
    )

    const getNoUSStatesFlagList = (cc: object):FlagTypeExt[] => {
        if (cc === undefined)
            return [];
        else
        {
                var ret: FlagTypeExt[] = [];
                var i:number = 0;
                for (const [key, value] of Object.entries(cc)) 
                {
                    if (!key.startsWith("us-")) 
                        ret[i++] = {url: urlbase + key + ".svg", countrycode: key, name: value.toUpperCase(), ix:i};
                    
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
        
        const correctFlag:FlagTypeExt = flags[newIx];
        const wrongFlag2:FlagTypeExt = flags[newIx2];
        const wrongFlag3:FlagTypeExt = flags[newIx3];

        const nextQuiz:QuizSet = {quizFlags: [correctFlag, wrongFlag2, wrongFlag3], quizPos: correctPos};
        setReveal(false);
        setAnswerIx(-1);
        setCurrentQuiz(nextQuiz);

        const a = correctFlag;
        setCurrentFlag(correctFlag);
    }

    const onAnswerQuiz = (answerIx: number, quizPos:number, correctFlagIndex: number) => {
        if (!reveal){
            setReveal(true);
            setAnswerIx(answerIx);
            setResults([...results, {flagIndex: correctFlagIndex, answer: (answerIx === quizPos)?true:false}]);
        }
    }

    const presentFlag = (quiz: QuizSet|undefined) => {
        const correctFlag = quiz?.quizFlags[quiz.quizPos]??undefined;

        return <div className="w-80 font-light flex flex-col items-center" key={correctFlag?.url}>
                    <div className="bg-slate-500">
                        <img className= "shadow-2xl" src={correctFlag?.url} width="300" height="250" alt="???????"/>
                    </div>
                </div>
    }

    const presentAlternatives = (quiz: QuizSet|undefined) => {
        const baseChoiceStyle:string = "my-2 p-4 text-wrap cursor-pointer rounded";
        const Neutral:string = baseChoiceStyle + " display-inline border bg-slate-200";
        const WrongAnswer:string = baseChoiceStyle + " bg-red-600"
        const CorrectAnswerWhenWrong:string = baseChoiceStyle + " bg-green-300"
        const CorrectAnswerWhenCorrect:string = baseChoiceStyle + " bg-green-500"
        //const classCorr = "my-1 px-2 text-wrap bg-green-500 cursor-pointer";
        const qPos = quiz?.quizPos;
        const correctFlagIndex = quiz?.quizFlags[quiz?.quizPos].ix;

        let lineTp: string[] = [] 
        if (answerIx === qPos) {
            for (let i = 0; i<3; i++)
                lineTp[i] = (i===answerIx)? CorrectAnswerWhenCorrect: Neutral;
        }
        else
        {
            for (let i = 0; i<3; i++) {
                lineTp[i] = ((qPos !== undefined) && (i === qPos))? CorrectAnswerWhenWrong :
                (((answerIx !== -1) && (i === answerIx))? WrongAnswer: Neutral);
            }
        }

        return (
            <>
                <div onClick={() => onAnswerQuiz(0, quiz?.quizPos??-1, correctFlagIndex??-1)} className={(reveal? lineTp[0]:Neutral)}>{quiz?.quizFlags[0].name}</div>
                <div onClick={() => onAnswerQuiz(1, quiz?.quizPos??-1, correctFlagIndex??-1)} className={(reveal? lineTp[1]:Neutral)}>{quiz?.quizFlags[1].name}</div>
                <div onClick={() => onAnswerQuiz(2, quiz?.quizPos??-1, correctFlagIndex??-1)} className={(reveal? lineTp[2]:Neutral)}>{quiz?.quizFlags[2].name}</div>
            </>
        )
    }

    
    return (
        <div className="p-2 bg-white text-black" >
            <div className="mx-auto w-80">
                <div className="flex flex-col justify-items-center place-items-stretch">
                {(currentQuiz) && presentFlag(currentQuiz)}
                    <div className="mx-4 mt-8">Velg alternativ:</div>
                    {(currentQuiz) && presentAlternatives(currentQuiz)}
                    <button className="mt-8 bg-blue-500 hover:bg-blue-700  text-white py-4 rounded" 
                        onClick={selectNextQuiz}>{(currentQuiz)?"Neste":"Sett i gang"} </button>
                    <div className="flex flex-row flex-wrap">
                        {results.map((i, index)=> <div key={index}>{(i.answer)?"😊":"🤨"}</div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quiz