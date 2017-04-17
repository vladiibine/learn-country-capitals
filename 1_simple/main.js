/**
 * Created by vardelean on 11/04/17.
 */

window.onload = function(){
    function getOption(){
        var checked_input;

        for(let input_element of document.forms[0]){
            if(input_element.checked){
                checked_input = input_element.id;
                break;
            }
        }
        return checked_input
    }

    function getCountriesMap(input_id){
        switch (input_id){
            case 'europe': return europe_countries;
            case 'asia': return asian_countries;
            case 'africa': return african_countries;
            case 'north_america': return north_american_countries;
            case 'south_america': return south_american_countries;
            case 'australia_and_oceania': return australia_and_oceanian_countries;
            case 'all_countries': return all_countries;
        }
    }

    /**
     *
     * @param {number} countries_number
     * @param {number} capitals_number
     * @param countries_map
     * @returns {{countries: Array, capitals: Array}}
     */
    function getCountriesForGameRound(countries_number, capitals_number, countries_map){
        var country_indexes = [];
        var capital_indexes = [];
        var country_keys = Object.keys(countries_map);

        for (var _ = 0; _ < countries_number; _++) {
            let index = Math.floor(Math.random() * country_keys.length);
            while (country_indexes.indexOf(index) !== -1) {
                index = Math.floor(Math.random() * country_keys.length);
            }

            country_indexes.push(index);
            let current_capital_indexes = [index];
            capital_indexes.push(current_capital_indexes);

            for (var j = 0; j < capitals_number - 1; j++) {
                let capital_index = Math.floor(Math.random() * country_keys.length);
                while (current_capital_indexes.indexOf(capital_index) !== -1) {
                    capital_index = Math.floor(Math.random() * country_keys.length);
                }
                current_capital_indexes.push(capital_index);
            }

        }
        return {
            countries: country_indexes,
            capitals: capital_indexes
        }
    }
    function shuffledArray(array){
        var result = [];
        var array_copy = Array.from(array);
        while(array_copy.length > 0){
            let index_to_pop = Math.floor(Math.random() * array_copy.length);
            result.push(array_copy.splice(index_to_pop, 1)[0])
        }
        return result;
    }

    /**
     *
     * @param country_choices: {{countries: Array, capitals: Array}}
     * @param countries_map: {Object}
     * @param {number} turn - the turn we're at (so we know where in country_choices to look)
     */
    function drawButtons(country_choices, countries_map, turn){
        document.getElementById('score').innerHTML = score;
        if(turn >= country_choices.countries.length){
            alert(
                "Congrats!!! You achieved "
                + score + " out of " + TURNS + " => " + (score / TURNS) * 100 + "%" + ". Refresh to play again!"
            )
        }

        var b1 = document.getElementById('capital1');
        var b2 = document.getElementById('capital2');
        var b3 = document.getElementById('capital3');
        var b4 = document.getElementById('capital4');

        var shuffled_buttons = shuffledArray([b1, b2, b3, b4]);
        for(let button of shuffled_buttons){
            button.style.display = 'block';
            // TODO - there's probably some memory leak going on here... probably event handlers
            // should be removed differently. If not, garbage collect ftw, but I doubt I'm that lucky
            button.onclick = undefined;
        }
        var correct_button = shuffled_buttons.splice(0, 1)[0];
        var incorrect_buttons = shuffled_buttons;

        var country_keys = Object.keys(countries_map);
        document.getElementById('country_name').innerHTML = country_keys[country_choices.countries[turn]];

        var country_capitals = [];

        for(let capital_index of country_choices.capitals[turn]){
            // let capital_index = country_choices.capitals[turn][capital_index];
            let capital_name = countries_map[country_keys[capital_index]];
            country_capitals.push(capital_name)
        }

        correct_button.innerHTML = country_capitals[0];
        for(let index=0; index<3; index++){
            // cuz 0 is the correct one, and we've already used that
            incorrect_buttons[index].innerHTML = country_capitals[index + 1];
            incorrect_buttons[index].onclick = function(){
                document.getElementById('last_turn_result').innerHTML = (
                "BAD! :( The capital of " +
                Object.keys(countries_map)[country_choices.countries[turn]] +
                " is " + country_capitals[0]);
                // TODO - this will fail after we hit the last turn
                // TODO - this probably will go on an infinite loop? Not really, this is a handler....
                // anyway, something weird can happen here, but i don't think it does.
                drawButtons(country_choices, countries_map, turn+1)
            }
        }

        correct_button.onclick = function (evt){
            // This button holds the true capital
            document.getElementById('last_turn_result').innerHTML =
                "GOOD! :) Indeed the capital of " +
                Object.keys(countries_map)[country_choices.countries[turn]] +
                " is " + country_capitals[0];
            score += 1;
            // TODO - This also fails after the last turn;
            drawButtons(country_choices, countries_map, turn+1)
        };

    }

    function redraw(){
        var checked_input = getOption();
        var countries_map = getCountriesMap(checked_input);
        var country_choices = getCountriesForGameRound(TURNS, 4, countries_map);

        drawButtons(country_choices, countries_map, 0);
    }

    const TURNS = 20;
    var score = 0;

    redraw();
    
    var countryRadios = document.querySelectorAll('[name=countries]');
    for(let inputField of countryRadios){
        inputField.addEventListener('click', redraw)
    }

};