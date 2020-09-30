const organizedByTags = (todos) => {
    const tags = [];
    todos.forEach((todo) => {
        todo.tags.forEach((tag) => {
            if (tags.indexOf(tag) === -1) {
                tags.push(tag);
            }
        });
    });
    const tagObjects = tags.map((tag) => {
        const toDoWithTags = [];
        todos.forEach((todo) => {
            if (todo.tags.indexOf(tag) !== -1) {
                toDoWithTags.push(todo.description);
            }
        });
        return {'name': tag, 'toDos': toDoWithTags};
    });
    return tagObjects;
};

const toDos = (tasks) => {
    return tasks.map((todo) => { return {'description': todo.description, 'id': todo._id}; });
};

const main = (tasks) => {
    'use strict';
    let tabs = [];
    tabs.push({
        'name': 'New',
        'content': (callback) => {
            $.get('/todos.json', (tasks) => {
                let $content = $('<ul>');
                toDos(tasks).reverse().forEach((todo) => {
                    let $listItem = $('<li>').text(todo.description);
                    let $itemLink = $('<a>').attr('href', `todos/${todo.id}`).text('Delete');
                    $listItem.append($itemLink);
                    $content.append($listItem);
                });
                callback(null, $content);
            }).fail((jqXHR, textStatus, error) => {
                callback(error, null);
            });
        }
    });
    tabs.push({
        'name': 'Old',
        'content': (callback) => {
            $.get('/todos.json', (tasks) => {
                let $content = $('<ul>');
                toDos(tasks).forEach((todo) => {
                    let $listItem = $('<li>').text(todo.description);
                    let $itemLink = $('<a>').attr('href', `todos/${todo.id}`).text('Delete');
                    $listItem.append($itemLink);
                    $content.append($listItem);
                });
                callback(null, $content);
            }).fail((jqXHR, textStatus, error) => {
                callback(error, null);
            });
        }
    });
    tabs.push({
        'name': 'Tags',
        'content': (callback) => {
            $.get('/todos.json', (tasks) => {
                const organizedByTag = organizedByTags(tasks);
                organizedByTag.forEach((tag) => {
                    let $content = $('<ul>');
                    $content.append($('<h4>').text(tag.name));
                    let $taskList = $('<ul>');
                    tag.toDos.forEach((description) => {
                        $taskList.append($('<li>').text(description));
                    });
                    $content.append($taskList);
                    callback(null, $content);
                });
            }).fail((jqXHR, textStatus, error) => {
                callback(error, null);
            });
        }
    });
    tabs.push({
        'name': 'Add',
        'content': () => {
            $('main .content').append($('<p>').text('Description'));
            $('main .content').append($('<input>').addClass('task'));
            $('main .content').append($('<p>').text('Tags'));
            $('main .content').append($('<input>').addClass('tags'));
            $('main .content').append($('<button>').text('Enter'));

            const addFromInput = () => {
                if ($('.content input.task').val() !== '' && $('.content input.tags').val() !== '') {
                    const newToDos = {'description': $('.content input.task').val(), 'tags': $('.content input.tags').val().replace(/\s/g, '').split(',')};
                    $.post('/todos', newToDos, () => {
                        $('.content input.task').val('');
                        $('.content input.tags').val('');
                        $('.tabs a:first-child span').trigger('click');
                    });
                }
            };

            $('.content button').on('click', () => {
                addFromInput();
            });
            $('.content input').on('keypress', (event) => {
                if (event.keyCode === 13) {
                    addFromInput();
                }
            });
        }
    });

    tabs.forEach((tab) => {
        let $aItem = $('<a>').attr('href', '');
        let $spanItem = $('<span>').text(tab.name);
        $aItem.append($spanItem);
        $('.tabs').append($aItem);
        $spanItem.on('click', () => {
            $('.tabs a span').removeClass('active');
            $spanItem.addClass('active');
            $('main .content').empty();
            tab.content((err, $content) => {
                if (err !== null) {
                    alert('Request error: ' + err);
                } else {
                    $('main .content').append($content);
                }
            });
            return false;
        });
    });

    $('.tabs a:first-child span').trigger('click');

};
$(document).ready(() => {
    $.getJSON('/todos.json', (tasks) => {
        main(tasks);
    });
});