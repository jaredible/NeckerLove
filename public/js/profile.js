var imageURL = 'https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg';
imageURL = '/account/image';

$("#inputImage").fileinput({
  overwriteInitial: true,
  showClose: false,
  showCaption: false,
  maxFileSize: 1024,
  browseIcon: '<i class="fas fa-folder-open"></i>',
  browseClass: ' btn btn-secondary',
  removeIcon: '<i class="fas fa-times"></i>',
  previewZoomButtonIcons: {
    toggleheader: '<i class="fas fa-arrows-alt-v"></i>',
    fullscreen: '<i class="fas fa-expand-arrows-alt"></i>',
    borderless: '<i class="fas fa-expand"></i>',
    close: '<i class="fas fa-times"></i>'
  },
  elErrorContainer: '#inputImage-errors',
  msgErrorClass: 'alert alert-block alert-danger',
  defaultPreviewContent: '<img src="' + imageURL + '" alt="" width="180" height="180">',
  layoutTemplates: {
    main2: '{preview} {remove} {browse}'
  },
  allowedFileExtensions: ["jpg", "png", "gif"],
  purifyHtml: true,
  fileActionSettings: {
    zoomIcon: '<i class="fas fa-search"></i>'
  }
});
