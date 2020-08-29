# gyujanggak
This project is for providing functions for answering questions from humans.

## Functions
1. A function for converting from a quesion to numbers and saving the result of "words - numbers" pairs as tokenizer. (relate functions : convert_from_a_question_to_numbers())
2. A function for crawling data to be premise.
3. A function for crawling data to be opinion.
4. A function for learning relation between premises and opinions
5. A function for predicting a opinion of a premise.

## Usage
1. Use dockerfile and make image 
2. In the Container use below command
> bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh) 
3. import gyujanggak

## Notions
1. if a tokenizer needs to enlarge words to perceive, ffirst, delete the current tokenizer. second, keep previous fit_on_texts data's keywords and order and just add a word which was not in previous.

## Maintainer
1. Yongwoon Jang (royalfamily89@gmail.com)
