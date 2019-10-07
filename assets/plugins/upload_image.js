document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        $('.upload_btn').click(function () {
            $('.upload_field[data-name="' + $(this).data('name') + '"]').click();
        });

        $('.preview').click(function () {
            $('.upload_field[data-name="' + $(this).data('name') + '"]').click();
        });

        $('.upload_field').change(function () {
            readURL(this, $(this).data('name'));
            $('input[name="' + $(this).data('name') + '-clear"]').prop('checked', false);
            $('.remove_image_btn[data-name=' + $(this).data('name') + ']').removeClass('hidden');
        });

        $('.remove_image_btn').click(function () {
            $('input[name="' + $(this).data('name') + '-clear"]').prop('checked', true);
            $('.preview[data-name="' + $(this).data('name') + '"]').html('<i class="fa fa-image"></i>');
            $(this).addClass('hidden');
        });

        function readURL(input, name) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();

                reader.onload = function (e) {
                    $('.preview[data-name="' + name + '"]').html('<img alt="Image" class="img-responsive" src="' + e.target.result + '">');
                };

                reader.readAsDataURL(input.files[0]);
            }
        }
    }
};