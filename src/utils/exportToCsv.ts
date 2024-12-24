export const exportToCSV = (data: object[], filename = "data.csv") => {
    if(!data || !data[0]) return
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(data[0]).join(","), // Header
        ...data.map((row) => Object.values(row).join(",")), // Rows
      ].join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  