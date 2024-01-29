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
                    if (!key.startsWith("us-")) {
                        ret[i] = {url: urlbase + key + ".svg", countrycode: key, name: value.toUpperCase(), ix:i};
                        i++;
                    }                    
                }
                return ret;
        }
    }


    const drawRandomIx = (numberOfFlags: number, avoid:number[]): number => {
        let finished:boolean = false;
        let candidate: number = Math.floor(Math.random()*numberOfFlags)
        while(avoid.includes(candidate)) {
            candidate = Math.floor(Math.random()*numberOfFlags);
        }
        return candidate;
    }

    const selectNextQuiz= (useErr?:boolean):void => {
        let earlierQuizError:QuizResult|undefined = undefined;
        let newIx0:number|undefined = undefined;
        let newIx1:number|undefined = undefined;
        let newIx2:number|undefined = undefined;

        const correctQuizPos = Math.floor(drawRandomIx(3, []));

        if (useErr) {
            earlierQuizError = results.find(i => i.answer === false);
        }

        if (correctQuizPos === 0)
            newIx0 = (earlierQuizError?.flagIndex)??Math.floor(drawRandomIx(flags.length, []))
        else 
            newIx0 = Math.floor(drawRandomIx(flags.length, []));
        
        if (correctQuizPos === 1)
            newIx1 = (earlierQuizError?.flagIndex)??Math.floor(drawRandomIx(flags.length, [newIx0]))
        else 
            newIx1 = Math.floor(drawRandomIx(flags.length, [newIx0]));

        if (correctQuizPos === 2)
            newIx2 = (earlierQuizError?.flagIndex)??Math.floor(drawRandomIx(flags.length, [newIx0, newIx1]))
        else 
            newIx2 = Math.floor(drawRandomIx(flags.length, [newIx0, newIx1]));

        const flag0:FlagTypeExt = flags[newIx0];
        const flag1:FlagTypeExt = flags[newIx1];
        const flag2:FlagTypeExt = flags[newIx2];

        const nextQuiz:QuizSet = {quizFlags: [flag0, flag1, flag2], quizPos: correctQuizPos};
        setReveal(false);
        setAnswerIx(-1);
        setCurrentQuiz(nextQuiz);
    }

    const updateResults = (oldResults:QuizResult[], newResult:QuizResult):QuizResult[] => {
        // If same flag has been used before, update that result, else add result
        let newResults:QuizResult[]= [];
        const prevAnswerIx:number = oldResults.findIndex((r) => r.flagIndex === newResult.flagIndex)
        if ((prevAnswerIx!==-1) && (oldResults[prevAnswerIx].answer===false)) {// update old answer
            oldResults[prevAnswerIx].answer = newResult.answer;
            newResults = [...oldResults];
        }
        else if (prevAnswerIx===-1) // add new result
            newResults = [...results, newResult];
            
        return newResults;

    }

    const onAnswerQuiz = (answerIx: number, quizPos:number, correctFlagIndex: number) => {
        if (!reveal){
            setReveal(true);
            setAnswerIx(answerIx);
            const newResultset:QuizResult[] = updateResults(results, {flagIndex: correctFlagIndex, answer: (answerIx === quizPos)?true:false});
            setResults(newResultset);
        }
    }

    const onErr = () => {
        selectNextQuiz(true);
    }

    const presentFlag = (quiz: QuizSet|undefined) => {
        const correctFlag = quiz?.quizFlags[quiz.quizPos]??undefined;

        return <div className="w-80 font-light flex flex-col items-center" key={correctFlag?.url}>
                    <div className="">
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
                {(currentQuiz) && <div className="mx-4 mt-8 mb-2">Hvilket flagg er dette?</div>}
                <div className="flex flex-col justify-items-center place-items-stretch">
                {(currentQuiz) && presentFlag(currentQuiz)}
                    <div className="mx-4 mt-8">Velg alternativ:</div>
                    {(currentQuiz) && presentAlternatives(currentQuiz)}
                    <button className="mt-8 bg-blue-500 hover:bg-blue-700  text-white py-4 rounded" 
                        onClick={() => selectNextQuiz()}>{(currentQuiz)?"Neste":"Sett i gang"} </button>
                    <div className="mt-3 flex flex-row flex-wrap">
                        {results.map((i, index)=> <button onClick={onErr} key={index}>{(i.answer)?"😊":"🙃"}</button>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quiz