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
        const toDoWishTags = [];
        todos.forEach((todo) => {
            if (todo.tags.indexOf(tag) !== -1) {
                toDoWishTags.push(todo.description);
            }
        });
        return {'name': tag, 'toDos': toDoWishTags};
    });
    return tagObjects;
};

const main = (tasks) => {
    'use strict';
    let toDos;
    let tabs = [];

    const reNewToDos = () => {
        toDos = tasks.map((todo) => {
            return todo.description;
        });
    };
    reNewToDos();
    tabs.push({
        'name': 'New',
        'content': () => {
            let $content = $('<ul>');
            toDos.reverse().forEach((todo) => {
                $content.append($('<li>').text(todo));
            });
            $('main .content').append($content);
            toDos.reverse();
        }
    });
    tabs.push({
        'name': 'Old',
        'content': () => {
            let $content = $('<ul>');
            toDos.forEach((todo) => {
                $content.append($('<li>').text(todo));
            });
            $('main .content').append($content);    
        }
    });
    tabs.push({
        'name': 'Tabs',
        'content': () => {
            const organizedByTag = organizedByTags(tasks);
            organizedByTag.forEach((tag) => {
                let $tagName = $('<h4>').text(tag.name);
                let $content = $('<ul>');
                tag.toDos.forEach((description) => {
                    $content.append($('<li>').text(description));
                });
                $('main .content').append($tagName);
                $('main .content').append($content);
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
                        console.log('We send and recive data from server.');
                        console.log(response);
                    });
                    tasks.push(newToDos);
                    reNewToDos();
                    $('.content input.task').val('');
                    $('.content input.tags').val('');
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
            $('main .content').append(tab.content());
            return false;
        });
    });

    $('.tabs a:first-child span').trigger('click');
};
$(document).ready(() => {
    $.getJSON('/todo.json', (tasks) => {
        main(tasks);
    });
});