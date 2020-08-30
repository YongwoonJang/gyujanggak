#-*-coding:utf8-*-
import sys

from os import path 

import logging 

import json
import numpy as np

from konlpy.tag import Mecab

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation
from tensorflow.keras.layers import Embedding
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import Conv1D, MaxPooling1D
from tensorflow.keras.models import load_model

from sklearn.model_selection import train_test_split

class Gyujanggak:
    def __init__(self):
        logging.basicConfig(level=logging.DEBUG)
        self.mecab = Mecab()
        self.tokenizer_path = "./tokenizer/tokenizer.json"
        self.checkpoint_path = "./model/cp.ckpt"
        self.model_path = "./model/model.h5"
        self.words_path = "./words/words.npy" 
        # Set for tokenizer
        self.max_words = 1000
        # Set for AI
        self.maxlen = 100  

        if (path.exists(self.tokenizer_path)) :
            with open(self.tokenizer_path) as handle:
                self.tokenizer = tokenizer_from_json(json.load(handle))
        


    def create_model(self):
        model = Sequential()
        model.add(Embedding(input_dim=self.max_features, output_dim=64, input_length=self.maxlen))
        model.add(Dropout(0.25))
        #model.add(Conv1D(filters = 64, 
        #    kernel_size = 5, 
        #    padding="valid", 
        #    activation="relu",
        #    strides=1))
        #model.add(MaxPooling1D(pool_size=3))
        model.add(LSTM(self.maxlen))
        model.add(Dense(1))
        model.add(Activation("softmax"))
        model.compile(loss='binary_crossentropy',
                optimizer='adam',
                metrics=['accuracy'])
        model.summary()
        return model

    def learn(self): 
        questions = []
        answer_categories = []
        for element in self.question:
            questions.append(mecab.morphs(element.question))
            if(element.answer_category != None):
                answer_categories.append(mecab.morphs(element.answer_category))
            else:
                answer_categories.append("없음")
        
        sequence_questions = self.tokenizer.texts_to_sequences(
                questions
        )
        sequence_answer_categories = self.tokenizer.texts_to_sequences(
                answer_categories
        )
        
        sequence_questions = sequence.pad_sequences(sequence_questions, maxlen=self.maxlen)
        sequence_answer_categories = sequence.pad_sequences(sequence_answer_categories, maxlen=self.maxlen)
        
        X_train, X_test, y_train, y_test = train_test_split(sequence_questions,
                sequence_answer_categories,
                test_size=0.2,
                shuffle=False,
                random_state=1)

        self.model.fit(X_train, 
                y_train,
                epochs=5,
                validation_data=(X_test, y_test),
                verbose=1)
       
        self.model.save(self.model_path)

    def numberizer(self, text):
        questions = []
        text_sequence = [[]]
        words = self.mecab.morphs(text)
        temp_words = []
        questions.append(words) 
        
        # Set a tokenizer 
        if ( path.exists(self.tokenizer_path) ) :
            text_sequence = self.tokenizer.texts_to_sequences(questions)
        else :
            self.tokenizer = Tokenizer(num_words = self.max_words)        
        
        # Update the tokenizer
        # Save the tokenizer
        if ( (len(questions[0]) - len(text_sequence[0])) >= 2 ) :
            # Load new words and Collect with current words
            if ( path.exists(self.words_path) ) :
                data = np.load(self.words_path)
                for word in data.tolist() :
                    temp_words.append(word)
            
            # Collect current words which are not in previous
            for word in words :
                if ( word not in temp_words) :
                    temp_words.append(word) 
            
            np.save(self.words_path,np.array(temp_words)) 
            logging.debug(temp_words)
           
            # Create new tokenizer
            self.tokenizer = Tokenizer(num_words = self.max_words)
            self.tokenizer.fit_on_texts(temp_words)
            
            # Save the tokenizer
            with open(self.tokenizer_path, mode="w", encoding="utf-8") as handle:
                json.dump(self.tokenizer.to_json(),handle)
        logging.debug(questions)
        logging.debug(self.tokenizer.texts_to_sequences(questions))    
        # Convert text to number
        return self.tokenizer.texts_to_sequences(questions)

if __name__ == '__main__':
    gyujanggak = Gyujanggak()
    gyujanggak.numberizer("test materials")
