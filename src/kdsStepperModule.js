/**
 * Created by NDS on 18/12/2015.
 */
'use strict';

var iconDone = {
  id:  'md-done',
  url: 'md-done.svg',
//svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/></g></svg>'
  svg: '<svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/> </svg>>'
};

angular.module('kds.stepper', ['ngMaterial'])
  .config(function ($mdIconProvider) {
    $mdIconProvider.icon(iconDone.id, iconDone.url, 24);
  })
  .run(function ($http, $templateCache) {
    $templateCache.put(iconDone.url, iconDone.svg);
  });