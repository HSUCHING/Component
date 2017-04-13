const config = {
  db: "EthicallBI",
  mongodb: "mongodb://localhost/",
  defaultName: "admin",
  defaultPassword: "admin",
  viewsMapping: {
    "AD": "allData",
    "TDRT": "transactionDataRegionTerminal",
    "TDRR": "transactionDataRegionRepeat",
    "FD": "financeData"
  }
};


module.exports = config;
