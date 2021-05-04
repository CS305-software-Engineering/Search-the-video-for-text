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
import sys
#nltk.download("stopwords")
from nltk.corpus import stopwords

stopwords = stopwords.words("english")
import copy


def clean_string(text):
    text = ''.join([word for word in text if word not in string.punctuation])
    text = text.lower()
    text = ' '.join([word for word in text.split() if word not in stopwords])
    return text


def NLP(file_path, search_query):
    ##file_contents = copy.deepcopy(file_path)

    index = []
    text = []
    time_stamp = []
    match = []

    #f = open(file_path)
    file_contents = file_path.split("\n")
    # for x in file_path:
    #     file_contents.append(x)

    #print("File contents", file_contents)

    i = 2
    while i < len(file_contents) - 3:
        match.append(0)
        index.append(file_contents[i].strip())
        i += 1
        time_stamp.append(file_contents[i].strip())
        i += 1
        # text.append(file_contents[i].strip())
        # i += 2
        current_text = ""
        while i < len(file_contents) and file_contents[i] != '':
            current_text += file_contents[i].strip() + " "
            i += 1
        text.append(current_text)

        while i < len(file_contents) and file_contents[i] == '':
            i += 1

    # print("Index:",index)
    # print("Time Stamp:",time_stamp)
    # print("Text:",text)
    # print("Match:",match)
    result = {
        "result-1": "",
        "time-stamp-1": "",
        "result-2": "",
        "time-stamp-2": "",
        "result-3": "",
        "time-stamp-3": "",
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
    arr = pairwise_similarity.toarray()
    np.fill_diagonal(arr, np.nan)
    result_idx = np.nanargmax(arr[tfidf.shape[0] - 1])
    match[result_idx] = 1
    # print("TF-IDF result:",sentences[result_idx])
    # print("TF-IDF time-stamp:",time_stamp[result_idx])

    result["result-1"] = sentences[result_idx]
    result["time-stamp-1"] = time_stamp[result_idx]

    cleaned = list(map(clean_string, sentences))
    # print("Cleaned:", cleaned)
    vectorizer = CountVectorizer().fit_transform(cleaned)
    vectors = vectorizer.toarray()
    csim = cosine_similarity(vectors)
    arr = csim
    np.fill_diagonal(arr, np.nan)
    result_idx = np.nanargmax(arr[vectorizer.shape[0] - 1])
    match[result_idx] = 1
    # print("Cosine-Similarity Result:",sentences[result_idx])
    # print("Cosine-Similarity Time Stamp:",time_stamp[result_idx])

    result["result-2"] = sentences[result_idx]
    result["time-stamp-2"] = time_stamp[result_idx]

    leven_ind = -1
    leven_score = 10000
    for i in range(0, len(sentences) - 1):
        current_leven = Levenshtein.distance(sentences[len(sentences) - 1],
                                             sentences[i])
        if current_leven < leven_score:
            leven_score = current_leven
            leven_ind = i
    # print("Leven:",sentences[leven_ind])
    # print("Leven:",time_stamp[leven_ind])

    result["result-3"] = sentences[leven_ind]
    result["time-stamp-3"] = time_stamp[leven_ind]

    json_result = json.dumps(result)
    print(json_result)  ## "\n\n", file_contents)
    return json_result


file_path = "WEBVTT\n\n1\n00:00:00.000 --> 00:00:00.000\n\n\n2\n00:00:00.000 --> 00:00:09.000\nplay song to industrial management\n I am your instructor\n\n3\n00:00:09.000 --> 00:00:09.000\n\n\n4\n00:00:09.000 --> 00:00:12.000\n\n\n5\n00:00:12.000 --> 00:00:15.000\npostcode is hs301\n\n6\n00:00:15.000 --> 00:00:15.000\n\n\n7\n00:00:15.000 --> 00:00:16.000\n\n\n8\n00:00:16.000 --> 00:00:18.000\ntoday's\n\n9\n00:00:18.000 --> 00:00:20.000\n18 days later\n\n10\n00:00:20.000 --> 00:00:22.000\nwhen do go to\n\n11\n00:00:22.000 --> 00:00:25.000\nthe following introduction\n\n12\n00:00:25.000 --> 00:00:31.000\ndiscuss the course information sheet\n\n13\n00:00:31.000 --> 00:00:33.000\n\n\n14\n00:00:33.000 --> 00:00:38.000\nyou can ask me by email\n\n15\n00:00:38.000 --> 00:00:38.000\n\n\n16\n00:00:38.000 --> 00:00:40.000\nany possible near winter\n\n17\n00:00:40.000 --> 00:00:44.000\nglass up isn't it\n\n18\n00:00:44.000 --> 00:00:46.000\n\n\n19\n00:00:46.000 --> 00:00:48.000\nwhat about me\n\n20\n00:00:48.000 --> 00:00:51.000\nbecause of this pandemic\n\n21\n00:00:51.000 --> 00:00:54.000\nwe are not able to meet face-to-face anyway\n\n22\n00:00:54.000 --> 00:00:56.000\n\n\n23\n00:00:56.000 --> 00:00:57.000\nis my beef for fine\n\n24\n00:00:57.000 --> 00:00:59.000\nyou can go to\n\n25\n00:00:59.000 --> 00:01:01.000\ndisc profiling\n\n26\n00:01:01.000 --> 00:01:01.000\n\n\n27\n00:01:01.000 --> 00:01:02.000\n\n\n28\n00:01:02.000 --> 00:01:03.000\n\n\n29\n00:01:03.000 --> 00:01:05.000\nwill it be your fire TV\n\n30\n00:01:05.000 --> 00:01:07.000\nin the humanities and social sciences\n\n31\n00:01:07.000 --> 00:01:09.000\ndepartment section\n\n32\n00:01:09.000 --> 00:01:09.000\n\n\n33\n00:01:09.000 --> 00:01:10.000\n\n\n34\n00:01:10.000 --> 00:01:11.000\n\n\n35\n00:01:11.000 --> 00:01:14.000\nas far as it goes is concerned\n\n36\n00:01:14.000 --> 00:01:14.000\n\n\n37\n00:01:14.000 --> 00:01:16.000\n\n\n38\n00:01:16.000 --> 00:01:21.000\nhorse racing course\n\n39\n00:01:21.000 --> 00:01:24.000\nvia to Faculty members in\n\n40\n00:01:24.000 --> 00:01:28.000\nthe Department of HSS\n\n41\n00:01:28.000 --> 00:01:31.000\nme and I'm going to handle\n\n42\n00:01:31.000 --> 00:01:35.000\n\n\n43\n00:01:35.000 --> 00:01:36.000\n\n\n44\n00:01:36.000 --> 00:01:41.000\npost-mortem section will be hanged in British\n\n45\n00:01:41.000 --> 00:01:45.000\nplease no download\n\n46\n00:01:45.000 --> 00:01:49.000\nand this the landline to which you can reach me doing officer\n\n47\n00:01:49.000 --> 00:01:49.000\n\n\n48\n00:01:49.000 --> 00:01:53.000\nequip\n\n49\n00:01:53.000 --> 00:01:54.000\n\n\n50\n00:01:54.000 --> 00:01:54.000\n\n\n51\n00:01:54.000 --> 00:01:56.000\n\n\n52\n00:01:56.000 --> 00:01:59.000\nBolivian to follow to textbooks\n\n53\n00:01:59.000 --> 00:02:04.000\nboth of these books are available on Amazon\n\n54\n00:02:04.000 --> 00:02:06.000\nyou will find the\n\n55\n00:02:06.000 --> 00:02:08.000\nMedia versions as well\n\n56\n00:02:08.000 --> 00:02:11.000\nin Portchester\n\n57\n00:02:11.000 --> 00:02:14.000\nthe first one is by William Stevenson\n\n58\n00:02:14.000 --> 00:02:16.000\noperations management\n\n59\n00:02:16.000 --> 00:02:18.000\nI'm going to follow the 1333\n\n60\n00:02:18.000 --> 00:02:19.000\n\n\n61\n00:02:19.000 --> 00:02:22.000\nsecond by\n\n62\n00:02:22.000 --> 00:02:24.000\nJacob's and cheese\n\n63\n00:02:24.000 --> 00:02:27.000\npatient management 15th edition\n\n64\n00:02:27.000 --> 00:02:27.000\n\n\n65\n00:02:27.000 --> 00:02:29.000\nwhat is the\n\n66\n00:02:29.000 --> 00:02:31.000\nbooks are available in Indian\n\n67\n00:02:31.000 --> 00:02:33.000\n\n\n68\n00:02:33.000 --> 00:02:35.000\n\n\n69\n00:02:35.000 --> 00:02:36.000\n\n\n70\n00:02:36.000 --> 00:02:39.000\na delivery Ward this time is obviously\n\n71\n00:02:39.000 --> 00:02:41.000\nwhen doing online\n\n72\n00:02:41.000 --> 00:02:43.000\nI'm going to upload\n\n73\n00:02:43.000 --> 00:02:49.000\nmy lectures on Google Drive and I'm going to share the link with him\n\n74\n00:02:49.000 --> 00:02:51.000\nyou just don't understand\n\n75\n00:02:51.000 --> 00:02:55.000\n\n\n76\n00:02:55.000 --> 00:03:01.000\nnot going to very important distribution section\n\n77\n00:03:01.000 --> 00:03:10.000\ngoing to be an assignment\n\n78\n00:03:10.000 --> 00:03:10.000\n\n\n79\n00:03:10.000 --> 00:03:14.000\ngoodnight can be single assignment assignment\n\n80\n00:03:14.000 --> 00:03:16.000\nI have naughty decided on there\n\n81\n00:03:16.000 --> 00:03:20.000\n20%\n\n82\n00:03:20.000 --> 00:03:21.000\nI can give you\n\n83\n00:03:21.000 --> 00:03:25.000\nequaliser\n\n84\n00:03:25.000 --> 00:03:32.000\nexam\n\n85\n00:03:32.000 --> 00:03:35.000\nremind me we asked operator swallow\n\n86\n00:03:35.000 --> 00:03:37.000\n\n\n87\n00:03:37.000 --> 00:03:39.000\n\n\n88\n00:03:39.000 --> 00:03:40.000\n\n\n89\n00:03:40.000 --> 00:03:43.000\nturn digital LinkedIn exam\n\n90\n00:03:43.000 --> 00:03:47.000\nend of term exam\n\n91\n00:03:47.000 --> 00:03:53.000\ndescent into pencil instructions from the Academy\n\n92\n00:03:53.000 --> 00:03:56.000\nturn diesel in w\n\n93\n00:03:56.000 --> 00:04:00.000\n15% and exam exam\n\n94\n00:04:00.000 --> 00:04:04.000\n\n\n95\n00:04:04.000 --> 00:04:14.000\nvictim statement example these will be British and will be informed by him\n\n96\n00:04:14.000 --> 00:04:17.000\nproportions\n\n97\n00:04:17.000 --> 00:04:22.000\nnoisy reverse from last myself a subject to change depending on the current situation\n\n98\n00:04:22.000 --> 00:04:24.000\nGirlington\n\n99\n00:04:24.000 --> 00:04:24.000\n\n\n100\n00:04:24.000 --> 00:04:26.000\n\n\n101\n00:04:26.000 --> 00:04:26.000\n\n\n102\n00:04:26.000 --> 00:04:27.000\n\n\n103\n00:04:27.000 --> 00:04:30.000\n\n\n104\n00:04:30.000 --> 00:04:33.000\ndisintegrating part\n\n105\n00:04:33.000 --> 00:04:34.000\n\n\n106\n00:04:34.000 --> 00:04:34.000\n\n\n107\n00:04:34.000 --> 00:04:35.000\n\n\n108\n00:04:35.000 --> 00:04:37.000\nwe are in the photo\n\n109\n00:04:37.000 --> 00:04:49.000\nInstitute rules as far as signing for this course is for this course will be 30% of 30\n\n110\n00:04:49.000 --> 00:04:54.000\nif you score listen that will be great\n\n111\n00:04:54.000 --> 00:04:54.000\n\n\n112\n00:04:54.000 --> 00:04:55.000\n\n\n113\n00:04:55.000 --> 00:04:57.000\nunderfloor heating Reading\n\n114\n00:04:57.000 --> 00:05:03.000\nsister\n\n115\n00:05:03.000 --> 00:05:08.000\nreading is from as you can see from A2\n\n116\n00:05:08.000 --> 00:05:12.000\n3 - 20 - 60 - 15\n\n117\n00:05:12.000 --> 00:05:14.000\nAndy's attentive\n\n118\n00:05:14.000 --> 00:05:16.000\npercentage of students\n\n119\n00:05:16.000 --> 00:05:22.000\nglass going to be a disgrace depends on it\n\n120\n00:05:22.000 --> 00:05:24.000\nactually\n\n121\n00:05:24.000 --> 00:05:25.000\n\n\n122\n00:05:25.000 --> 00:05:30.000\n\n\n123\n00:05:30.000 --> 00:05:32.000\nescorting an e\n\n124\n00:05:32.000 --> 00:05:37.000\nscore of 80 out of required\n\n125\n00:05:37.000 --> 00:05:38.000\n\n\n126\n00:05:38.000 --> 00:05:39.000\n\n\n127\n00:05:39.000 --> 00:05:43.000\nthat doesn't mean that everyone is intimate\n\n128\n00:05:43.000 --> 00:05:45.000\n\n\n129\n00:05:45.000 --> 00:05:46.000\n\n\n130\n00:05:46.000 --> 00:05:50.000\n\n\n131\n00:05:50.000 --> 00:05:53.000\nI hope there is clarity on degrading front\n\n132\n00:05:53.000 --> 00:05:53.000\n\n\n133\n00:05:53.000 --> 00:05:54.000\n\n\n134\n00:05:54.000 --> 00:05:54.000\n\n\n135\n00:05:54.000 --> 00:05:57.000\nDeezer list of topics\n\n136\n00:05:57.000 --> 00:05:58.000\nI'm going to be\n\n137\n00:05:58.000 --> 00:06:00.000\n\n\n138\n00:06:00.000 --> 00:06:00.000\n\n\n139\n00:06:00.000 --> 00:06:02.000\ncoloured\n\n140\n00:06:02.000 --> 00:06:07.000\nthis time you're having 12 weeks\n\n141\n00:06:07.000 --> 00:06:10.000\nI'm not made any changes in the content\n\n142\n00:06:10.000 --> 00:06:10.000\n\n\n143\n00:06:10.000 --> 00:06:14.000\nplay Living Allowance regulations\n\n144\n00:06:14.000 --> 00:06:16.000\n\n\n145\n00:06:16.000 --> 00:06:17.000\nso\n\n146\n00:06:17.000 --> 00:06:18.000\nnext\n\n147\n00:06:18.000 --> 00:06:21.000\ncollecting onwards I will start with\n\n148\n00:06:21.000 --> 00:06:21.000\n\n\n149\n00:06:21.000 --> 00:06:24.000\nEnglish into operations management\n\n150\n00:06:24.000 --> 00:06:29.000\nwhat is a key officers and even means\n\n151\n00:06:29.000 --> 00:06:31.000\nimportance of operations manager\n\n152\n00:06:31.000 --> 00:06:32.000\n\n\n153\n00:06:32.000 --> 00:06:35.000\nI need to learn this subject\n\n154\n00:06:35.000 --> 00:06:38.000\nof course evelyn's Herald heart\n\n155\n00:06:38.000 --> 00:06:40.000\nnever had a face-to-face discussion\n\n156\n00:06:40.000 --> 00:06:49.000\nlive sessions you can ask me questions or queries make you aware of the importance of the subject\n\n157\n00:06:49.000 --> 00:06:51.000\nwhy doesn't go course\n\n158\n00:06:51.000 --> 00:06:52.000\n\n\n159\n00:06:52.000 --> 00:06:53.000\n\n\n160\n00:06:53.000 --> 00:06:56.000\ncourse\n\n161\n00:06:56.000 --> 00:06:58.000\n\n\n162\n00:06:58.000 --> 00:07:00.000\nthen we go to\n\n163\n00:07:00.000 --> 00:07:01.000\n\n\n164\n00:07:01.000 --> 00:07:02.000\nin the next\n\n165\n00:07:02.000 --> 00:07:06.000\nupcoming weeks and super section in facility layout\n\n166\n00:07:06.000 --> 00:07:07.000\n\n\n167\n00:07:07.000 --> 00:07:08.000\nlocation planning\n\n168\n00:07:08.000 --> 00:07:09.000\nforecasting\n\n169\n00:07:09.000 --> 00:07:11.000\n\n\n170\n00:07:11.000 --> 00:07:12.000\nproject management\n\n171\n00:07:12.000 --> 00:07:13.000\n\n\n172\n00:07:13.000 --> 00:07:16.000\nstop tvs-682 classes\n\n173\n00:07:16.000 --> 00:07:19.000\nand posted that\n\n174\n00:07:19.000 --> 00:07:19.000\n\n\n175\n00:07:19.000 --> 00:07:23.000\ntraining station\n\n176\n00:07:23.000 --> 00:07:24.000\nso\n\n177\n00:07:24.000 --> 00:07:28.000\nthis is all as far as\n\n178\n00:07:28.000 --> 00:07:31.000\ncourse information sheet discount sound\n\n179\n00:07:31.000 --> 00:07:34.000\nplease go through the\n\n180\n00:07:34.000 --> 00:07:36.000\nincluding criterias\n\n181\n00:07:36.000 --> 00:07:37.000\n\n\n182\n00:07:37.000 --> 00:07:39.000\nghost content\n\n183\n00:07:39.000 --> 00:07:41.000\ngo to\n\n184\n00:07:41.000 --> 00:07:42.000\ndifferent\n\n185\n00:07:42.000 --> 00:07:45.000\nevaluation criteria\n\n186\n00:07:45.000 --> 00:07:47.000\ndiscuss my name\n\n187\n00:07:47.000 --> 00:07:53.000\nthink about it if any problems in adults free food email me\n\n188\n00:07:53.000 --> 00:07:56.000\nask a question Swindon\n\n189\n00:07:56.000 --> 00:07:58.000\n\n\n190\n00:07:58.000 --> 00:08:00.000\nlife\n\n191\n00:08:00.000 --> 00:08:03.000\n\n\n192\n00:08:03.000 --> 00:08:05.000\nthanks\n\n"
search_query = "google drive"
#NLP(file_path, search_query)
NLP(sys.argv[1], sys.argv[2])
