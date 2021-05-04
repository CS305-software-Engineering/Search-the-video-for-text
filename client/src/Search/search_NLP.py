import string
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import nltk
import sklearn
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import json
# from polyfuzz import PolyFuzz
import Levenshtein

# nltk.download("stopwords")
from nltk.corpus import stopwords
stopwords=stopwords.words("english")

def clean_string(text):
  text = ''.join([word for word in text if word not in string.punctuation])
  text = text.lower()
  text = ' '.join([word for word in text.split() if word not in stopwords])
  return text

def NLP(file_path,search_query):
    file_contents=[]

    index = []
    text = []
    time_stamp = []
    match = []

    f = open(file_path) 

    for x in f:
        file_contents.append(x)

    print(file_contents)

    i=2
    while i<len(file_contents):
        match.append(0)
        index.append(file_contents[i].strip())
        i+=1
        time_stamp.append(file_contents[i].strip())
        i+=1
        current_text=""
        while i<len(file_contents) and file_contents[i]!='\n':
            current_text+=file_contents[i].strip()+" "
            i+=1
        text.append(current_text)
        while i<len(file_contents) and file_contents[i]=='\n':
            i+=1

    # print("Index:",index)
    # print("Time Stamp:",time_stamp)
    # print("Text:",text)
    # print("Match:",match)
    result = {
        "result-1":"",
        "time-stamp-1":"",
        "result-2":"",
        "time-stamp-2":"",
        "result-3":"",
        "time-stamp-3":"",
    }
    # search_query="critical distribution part"
    # sentences=[
    #            "This is a foobar sentence",
    #            "This sentence is similar to a foobar sentence",
    #            "This is another string, but it is not quite similar to the previous ones",
    #            "I am also just another string",
    #            "Again not a foobar sentence"
    # ]

    sentences = text
    sentences.append(search_query)
    tfidf = TfidfVectorizer().fit_transform(sentences)
    pairwise_similarity = tfidf * tfidf.T
    arr=pairwise_similarity.toarray()
    np.fill_diagonal(arr, np.nan)
    result_idx = np.nanargmax(arr[tfidf.shape[0]-1])
    match[result_idx] = 1
    # print("TF-IDF result:",sentences[result_idx])
    # print("TF-IDF time-stamp:",time_stamp[result_idx])

    result["result-1"] = sentences[result_idx]
    result["time-stamp-1"] = time_stamp[result_idx]

    cleaned = list(map(clean_string,sentences))
    # print("Cleaned:", cleaned)
    vectorizer = CountVectorizer().fit_transform(cleaned)
    vectors = vectorizer.toarray()
    csim = cosine_similarity(vectors)
    arr=csim
    np.fill_diagonal(arr, np.nan)
    result_idx = np.nanargmax(arr[vectorizer.shape[0]-1])
    match[result_idx] = 1
    # print("Cosine-Similarity Result:",sentences[result_idx])
    # print("Cosine-Similarity Time Stamp:",time_stamp[result_idx])

    result["result-2"] = sentences[result_idx]
    result["time-stamp-2"] = time_stamp[result_idx]

    leven_ind = -1
    leven_score = 10000
    for i in range (0,len(sentences)-1):
        current_leven = Levenshtein.distance(sentences[len(sentences)-1],sentences[i])
        if current_leven < leven_score:
            leven_score = current_leven
            leven_ind = i
    print("Leven:",sentences[leven_ind])
    print("Leven:",time_stamp[leven_ind])

    result["result-3"] = sentences[leven_ind]
    result["time-stamp-3"] = time_stamp[leven_ind]


    json_result = json.dumps(result)
    print(json_result)
    return json_result

file_path = "transcribed_text.vtt"
search_query = "Institute rules for passing this course is 30%"
NLP(file_path,search_query)