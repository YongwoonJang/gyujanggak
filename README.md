# gyujanggak
This project is for providing functions for answering questions from humans.

## Functions
1. A function for korean morpheme analize. (relate functions : convert_from_a_question_to_numbers())
2. A function for crawling data to be premise.
3. A function for crawling data to be opinion.
4. A function for learning relation between premises and opinions
5. A function for predicting a opinion of a premise.

## Usage
1. Use dockerfile and make image 
2. In the Container use below command
> bash <(curl -s https://raw.githubusercontent.com/konlpy/konlpy/master/scripts/mecab.sh) 
3. import gyujanggak

## Cautions 
1. if you update token, you should execute learning function. because if you update token then all the numbers which are matched with words are changed, even though they are tokenized in order compliant with previous one.

## Maintainer
1. Yongwoon Jang (royalfamily89@gmail.com)
