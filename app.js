// variables
const categoriesAPI = 'https://opentdb.com/api_category.php';
const selectCategory = document.querySelector('.select-category');
const baseQuestionsAPI = 'https://opentdb.com/api.php?amount=10';
const questionsContainer = document.querySelector('.TenQuestions-container');
const questionsSection = document.querySelector('.questions-section');
const selectSettingsForm = document.querySelector('.select-settings-form');
const selectDifficulty = document.querySelector('#difficulty');
const selectType = document.querySelector('#type');
const questionsForm = document.querySelector('.questions-form');
const scoreSpan = document.querySelector('.score-span');
const scoreContainer = document.querySelector('.score-container');
const buttonCleanScore = document.querySelector('.btn-clean-score');
const submitQuestionsBtn = document.querySelector('.submit-questions-btn');
const alertNoQuestions = document.querySelector('.alert-no-questions');
const btnGotItNoQuestions = document.querySelector('.btn-got-it-noq');
const closeScoreBtn = document.querySelector('.close-score');

// functions
const fetchData = async (apiUrl) => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const assignCategoryOptions = (object) => {
    object.trivia_categories.forEach(category => {
        const newOption = document.createElement('option');
        newOption.value = category.id;
        newOption.id = category.id;
        newOption.classList.add('fs-5');
        newOption.innerHTML = category.name;
        selectCategory.append(newOption);
    })
}

const generateCustomizedAPI = (category, difficulty, type) => {
    console.log(`${baseQuestionsAPI}&category=${category}&difficulty=${difficulty}&type=${type}`);
    return `${baseQuestionsAPI}&category=${category}&difficulty=${difficulty}&type=${type}`
}

const shuffleOptionsArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const displayQuestions = (object) => {
    questionsContainer.innerHTML = "";
    if(!alertNoQuestions.classList.contains('d-none')) {
        alertNoQuestions.classList.add('d-none');
    }
    if (object.results.length > 0) {
        let counter = 1;
        object.results.forEach(result => {
            const timeStamp = new Date().getTime();
            const newDiv = document.createElement('div');
            newDiv.innerHTML = `<div class="question-container d-flex gap-2 col-12">
            <p class="fs-4">${counter}.</p>
            <div class="d-flex flex-column">
                <label for="_${counter}_${timeStamp}" class="fs-4 mb-2">${result.question}</label>
                <select id="_${counter}_${timeStamp}" class="question-select-element form-select fs-5" style="width: 270px;" data-correct-answer=${result.correct_answer}>
                    <option value="">Choose</option>
                </select>
            </div>
        </div>`;
    
            questionsContainer.append(newDiv);
            const selectElement = document.querySelector(`#_${counter}_${timeStamp}`);
    
            let answersArray = null;
            if (result.type === "boolean") {
                answersArray = ["True", "False"];
            } else {
                answersArray = [result.correct_answer, ...result.incorrect_answers];
                shuffleOptionsArray(answersArray);
            }
    
            answersArray.forEach(answer => {
                const newOption = document.createElement('option');
                newOption.innerHTML = answer;
                newOption.value = answer;
                newOption.classList.add('fs-5');
                selectElement.append(newOption);
            });
            counter++;
        });
        submitQuestionsBtn.classList.remove('d-none');
    } else {
        alertNoQuestions.classList.remove('d-none');
        if(!submitQuestionsBtn.classList.contains('d-none')) {
            submitQuestionsBtn.classList.add('d-none');
        }
        if (!scoreContainer.classList.contains('d-none')) {
            scoreContainer.classList.add('d-none');
        }
    }
    questionsSection.classList.remove('d-none');
}

const displayScore = () => {
    let score = 0;
    const questionSelects = document.querySelectorAll('.question-select-element');
    questionSelects.forEach(select => {
        if (select.value === select.dataset.correctAnswer) {
            score+=100;
        }
    });
    scoreSpan.innerHTML = score;
    scoreContainer.classList.remove('d-none');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        try {
            const categoriesData = await fetchData(categoriesAPI);
            assignCategoryOptions(categoriesData);
        } catch (error) {
            console.error(error);
        }
    })();
});

selectSettingsForm.addEventListener('submit', async e => {
    e.preventDefault();
    const designatedApi = generateCustomizedAPI(selectCategory.value, selectDifficulty.value, selectType.value);
    try {
        const questionsObject = await fetchData(designatedApi);
        displayQuestions(questionsObject);
    } catch (error) {
        console.error(error);
    }
});

questionsForm.addEventListener('submit', e => {
    e.preventDefault();
    displayScore();
})

btnGotItNoQuestions.addEventListener('click', () => {
    alertNoQuestions.classList.add('d-none');
    questionsSection.classList.add('d-none');
});

buttonCleanScore.addEventListener('click', () => {
    submitQuestionsBtn.classList.add('d-none');
    scoreContainer.classList.add('d-none');
    questionsSection.classList.add('d-none');
});

closeScoreBtn.addEventListener('click', () => {
    scoreContainer.classList.add('d-none');
});