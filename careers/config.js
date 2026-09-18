window.CAREERS_CONFIG = {
  SHEET_ID: '1PQAJr6HEN-nkSZk005OSsqYzNF7gMmDfBdDDI3OvzHI',
  GIDS: {
    siteContent: '414647593',
    jobs: '633673770'
  }
};
function careersCsvUrl(gid){
  return 'https://docs.google.com/spreadsheets/d/'+CAREERS_CONFIG.SHEET_ID+'/export?format=csv&gid='+gid;
}
