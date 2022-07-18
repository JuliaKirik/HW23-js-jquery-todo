class TodoList {
    constructor(el) {
        this.el = el;
        this.$list = $('#list')[0];
        this.url = 'http://localhost:3000/todos';
 
        $(el).on('click', (event) => {
            if ($(event.target).hasClass("set-status")) {
                this.update(event);
            } else if ($(event.target).hasClass("addItem")) {
                let $valueInput = $('#input').val();
                this.add(this.url, new Task($valueInput));
            }
        })
    }

    update(event) {
        let $li = $(event.target).closest('li');
        let $id = $($li).attr('data-id'); 
        let $valueInput = $li.contents().get(0).nodeValue;
        let status = 'done';
        if ($li.hasClass('done')) {
            status = 'in-progress';
        }
        this.updates(this.url + `/${$id}`, new Task($valueInput, status));
    }

    getTodos(url) {
        return $.get(url)
    }

    add(url, task) {
        return $.post(url, task)
    }

    updates(url, task) {
        return this.put(url, task )
    }

    put(url, data) {
        return $.ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json'
        });
    }
    
    async render() {
        let result = await this.getTodos(this.url)
        try {
            $(this.$list).html(this.renderList(result));
        } catch (status) {
            console.error('Something went wrong', status);
        }
    }

    renderList(array) {
        let lis = '';
        for (let el of array) {
                if (!el) {
                return;
            }
            lis += `<li data-id="${el.id}" class="${el.status}">${el.task}<button class="set-status">Change status</button></li>`;
        }
        return lis;
    }
}

class Task {
    constructor(task, status = 'in-progress') {
        this.task = task;
        this.status = status;
    }
}

let $list = $('#list-wrap')[0];
let todo1 = new TodoList($list);
todo1.render();