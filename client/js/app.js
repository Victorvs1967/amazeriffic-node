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
    return tasks.map((todo) => { return todo.description; });
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
                    $content.append($('<li>').text(todo));
                });
                callback($content);
            });
        }
    });
    tabs.push({
        'name': 'Old',
        'content': (callback) => {
            $.get('/todos.json', (tasks) => {
                let $content = $('<ul>');
                toDos(tasks).forEach((todo) => {
                    $content.append($('<li>').text(todo));
                });
                callback($content);
            });
        }
    });
    tabs.push({
        'name': 'Tabs',
        'content': (callback) => {
            $.get('/todos.json', (tasks) => {
                const organizedByTag = organizedByTags(tasks);
                organizedByTag.forEach((tag) => {
                    let $tagName = $('<h4>').text(tag.name);
                    let $content = $('<ul>');
                    tag.toDos.forEach((description) => {
                        $content.append($('<li>').text(description));
                    });
                    callback($content, $tagName);
                });
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
                    const newToDos = {'description': $('.content input.task').val(), 'tags': $('.content input.tags').val().split(',')};
                    $.post('/todos', newToDos, (response) => {
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
            tab.content(($content, $tagName) => {
                if ($tagName) {
                    $('main .content').append($tagName);
                    $('main .content').append($content);
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