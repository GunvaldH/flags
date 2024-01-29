'use client'
import {useState, useEffect} from 'react';
import {SearchField, Label, Input, Button} from 'react-aria-components';

const urlbase = "https://flagcdn.com/"

type FlagType = {
    url: string
    countrycode: string
    name: string
}


const AllTheFlags = () => {

    const [filter, setFilter] = useState<string>("");
    const [flags, setFlags] = useState<FlagType[]>([])
    const [countrycodes, setcountrycodes] = useState(null);

    useEffect(() => {
        fetch("https://flagcdn.com/no/codes.json")
        .then(res => res.json())
        .then((res:any) => setcountrycodes(res))
    }, []
    )


    const presentFlags = (flags: FlagType[]) => {
        return <div className="flex flex-row flex-wrap">{flags.map(x => presentFlag(x))}</div>
    }

    const getAllFlagList = (cc: object):FlagType[] => {
        if (cc === undefined)
            return [];
        else
        {
                var ret: FlagType[] = [];
                var i:number = 0;
                for (const [key, value] of Object.entries(cc)) 
                {
                    ret[i++] = {url: urlbase + key + ".svg", countrycode: key, name: value};
                    
                }
                return ret;
        }
    }

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

    const sortedFlagList = (unsortedflags:FlagType[]):FlagType[] => {
        const sortedflags = [...unsortedflags].sort((prev, item) => prev.name.localeCompare(item.name))
        return sortedflags;
    }

    const filterFlagList = (searchText:string, unfilteredFlags: FlagType[]):FlagType[] => {
        const filteredList:FlagType[] = (searchText === "")? unfilteredFlags: unfilteredFlags.filter((item) => item.name.includes(searchText.toUpperCase()));
        return filteredList; 
    }

    const presentFlag = (flag: FlagType) => {
        return <div className="w-52 p-2 m-2 font-light flex flex-col items-center" key={flag.url}>
                    <div className="bg-slate-50">
                        <img className= "shadow-2xl" src={flag.url} width="400" height="300" alt={flag.name}/>
                        <div className="my-1 px-2 text-wrap">{flag.name}</div>
                    </div>
                </div>
    }

    return (
        <div className="bg-slate-50">

            <SearchField onChange={setFilter} className="text-center" autoFocus>
                <Label className="align-baseline">SØK ETTER FLAGG:</Label>
                <Input className="px-2"/>
            </SearchField>
            <div className="">
                 {(countrycodes) && presentFlags(sortedFlagList(filterFlagList(filter, getNoUSStatesFlagList(countrycodes))))}
            </div>
        </div>
    )
} 

export default AllTheFlags