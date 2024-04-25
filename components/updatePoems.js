import { db } from "../firebase.config";
import { ref, push, remove } from "firebase/database";
import { auth } from "../firebase.config";
import { v4 as uuidv4 } from 'uuid';

//generate random numbers within limits to get poems of varying linecounts
//get fetch requests
const generateRequests = () => {
    console.log('requests');
    const min = 5;
    const max = 15;
    const poemCount = 3;
    const linecounts = [];
    for (let i = 0; i < poemCount; i++) {
        linecounts.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return linecounts.map(linecount => `https://poetrydb.org/random,linecount/1;${linecount}`)
};

export default async function UpdatePoems(dayChange) {
    console.log(dayChange);
    if (dayChange === true) {
        console.log('As you wish... have ur poems');
        const endpoints = generateRequests();
        const fetchPromises = endpoints.map(endpoint => fetch(endpoint));
        Promise.all(fetchPromises)
        .then(function (responses) {
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        })
        await(function (data) {
            data.map(object => {
                var arr = object[0].lines.reduce(function(array, content) {
                    array.push({id: uuidv4(), line: content});
                    return array;
                }, []);
                console.log('reached here');
                push(ref(db, `users/${user.uid}/dailies/`), {author: object[0].author, title: object[0].title, linecount: object[0].linecount, lines: arr});
            })
        })
        .then()
        .catch(function (error) {
            console.log(error);
        })
    } else {
        console.log('all quiet on the western front');
    }
}