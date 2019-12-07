function iformat(icon) {
    let originalOption = icon.element;
    return $('<div class="text-center"><i class="' + $(originalOption).val() + '"></i></div>');
}

$('select[data-type=icon]').select2({
    templateSelection: iformat,
    templateResult: iformat,
    allowHtml: true,
    height:100
});