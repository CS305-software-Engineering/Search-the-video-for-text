import sys
import json

# returns a list of indices which stores the indices at which the pattern is found
def KMP(pattern, text):
    M = len(pattern)
    N = len(text)
    lps = [0]*M
    j = 0
    indices = []
    LPSArray(pattern, M, lps)
    i = 0 
    while i < N:
        if pattern[j] == text[i]:
            i += 1
            j += 1
        if j == M:
            indices.append(i-M)
            j = lps[j-1]
        elif i < N and pattern[j] != text[i]:
            if j != 0:
                j = lps[j-1]
            else:
                i += 1
    result = json.dumps(indices)
    return result

def LPSArray(pattern, M, lps):
    len = 0 
    lps[0] = 0
    i = 1
    while i < M:
        if pattern[i]== pattern[len]:
            len += 1
            lps[i] = len
            i += 1
        else:
            if len != 0:
                len = lps[len-1]
            else:
                lps[i] = 0
                i += 1

file_path = "./server/search_service/transcribed_text.vtt"# sys.argv[1]
text = "Institute rules for passing this course is 30%" # sys.argv[2]
arr = []
f = open(file_path) 
for x in f:
    arr.append(x)
pattern = arr.join(" ")
print(pattern)
indices = KMP(pattern, text) 
print(indices)