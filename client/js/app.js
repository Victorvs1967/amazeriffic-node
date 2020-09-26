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
let toDos;
const main = (tasks) => {
    'use strict';
    const reNewToDos = () => {
        toDos = tasks.map((todo) => {
            return todo.description;
        });
    };
    reNewToDos();
    $('.tabs a span').toArray().forEach((tab) => {
        $(tab).on('click', () => {
            $('.tabs a span').removeClass('active');
            $(tab).addClass('active');
            $('main .content').empty();

            let $content;

            if ($(tab).parent().is(':nth-child(1)')) {
                $content = $('<ul>');
                toDos.reverse().forEach((todo) => {
                    $content.append($('<li>').text(todo));
                });
                $('main .content').append($content);
                toDos.reverse();
            } else if ($(tab).parent().is(':nth-child(2)')) {
                $content = $('<ul>');
                toDos.forEach((todo) => {
                    $content.append($('<li>').text(todo));
                });
                $('main .content').append($content);
            } else if ($(tab).parent().is(':nth-child(3)')) {
                const organizedByTag = organizedByTags(tasks);
                organizedByTag.forEach((tag) => {
                    const $tagName = $('<h4>').text(tag.name);
                    $content = $('<ul>');
                    tag.toDos.forEach((description) => {
                        $content.append($('<li>').text(description));
                    });
                    $('main .content').append($tagName);
                    $('main .content').append($content);
                });
                $('main .content').append($content);
            } else if ($(tab).parent().is(':nth-child(4)')) {
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
        $('.tabs a:first-child span').trigger('click');
    });
    return false;
};
$(document).ready(() => {
    $.getJSON('/todo.json', (tasks) => {
        main(tasks);
    });
});