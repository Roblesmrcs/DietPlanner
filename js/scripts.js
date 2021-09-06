document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,

    });
    calendar.render();

    var p = new Plan(calendar);
    p.test_presentation();
});


class Plan {
    constructor(calendar) {
        this.calendar = calendar;
        this.foods = [];
        this.kcals = false;
        this.spacing = 0; // time between repeating meals in days
    }

    addFood(food) {
        this.foods.push(food);
    }

    createPlanning() {
        this.foods = sort_food_list(this.foods);//orders list by priority
        const result = [];
        let actualDate = 0;
        while (actualDate < 30) { //Mientras haya menos de 30 comidas planeadas
            actualDate += 1;
            for (let i = 0; i < this.foods.length; i++) {
                let food = this.foods[i];
                if (food.last_time_eaten() + this.spacing > actualDate) {
                    this.foods[i].last_time_eaten(actualDate);
                    result.push(food);
                    break;
                } else {
                    if (i === this.foods.length) { //In the case that this is the last food and it isn't accepted
                        console.error("not enough foods provided");// it notifies the foods are not enough
                        return [];
                    }
                }
            }
        }
        return result;
    }

    presentPlanning(planningList) {


        const today = new Date();
        for (let i = 0; i < planningList.length; i++) {
            var date = new Date();
            date.setDate(today.getDate() + i); // will be in local time
            console.info(planningList[i]._name);
            this.calendar.addEvent({
                title: planningList[i]._name,
                start: date,
                allDay: true
            });
        }
    }

    test_presentation() {
        var planning = [];
        planning.push(new Food("1", 1));
        planning.push(new Food("2", 1));
        planning.push(new Food("3", 1));
        planning.push(new Food("4", 1));
        this.presentPlanning(planning);
    }
}

class Food {
    get last_time_eaten() {
        return this._last_time_eaten;
    }

    set last_time_eaten(value) {
        this._last_time_eaten = value;
    }

    get kcal() {
        return this._kcal;
    }

    set kcal(value) {
        this._kcal = value;
    }

    get spacing() {
        return this._spacing;
    }

    set spacing(value) {
        this._spacing = value;
    }

    constructor(name, priority) {
        /*Important fields of every food object*/
        this._name = name;
        this._priority = priority;
        /*Optional fields of food objects*/
        this._kcal = undefined;
        this._spacing = undefined;
        this._last_time_eaten = undefined;
    }

    get name() {
        return this._name;
    }

    get priority() {
        return this._priority;
    }
}


function sort_food_list(food_list) {
    return array.sort(function (a, b) {
        var x = a.getPriority();
        var y = b.getPriority;
        if (x <= y) {
            return -1;
        } else {
            return 1;
        }
    });
}

