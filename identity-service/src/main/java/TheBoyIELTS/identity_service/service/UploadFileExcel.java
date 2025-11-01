package TheBoyIELTS.identity_service.service;

import TheBoyIELTS.identity_service.DTO.DataFromExcelFile;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class UploadFileExcel {
    public static boolean isValidExcelFile(MultipartFile file){
        return Objects.equals(file.getContentType(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
    public static List<DataFromExcelFile> getDataFromExcelFile(InputStream inputStream){
        List<DataFromExcelFile> listData = new ArrayList<>();
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("data");
            log.info("1");
            int rowIndex = 0;
            for(Row row : sheet){
                if(rowIndex == 0){
                    rowIndex++;
                    continue;
                }
                Iterator<Cell> cellIterator = row.iterator();
                int cellIndex = 0;
                DataFromExcelFile data = new DataFromExcelFile();
                while(cellIterator.hasNext()){
                    Cell cell = cellIterator.next();
                    if(cellIndex == 0) {
                        data.setWord(cell.getStringCellValue());
                    }
                    else if (cellIndex == 1) {
                        data.setLevel(cell.getStringCellValue());
                    }
                    else if (cellIndex == 2) {
                        if (cell.getCellType() == CellType.BOOLEAN)
                            data.setLearned(cell.getBooleanCellValue());
                        else
                            data.setLearned(Boolean.parseBoolean(cell.getStringCellValue()));
                    }
                    else if (cellIndex == 3) {
                        data.setWrongCount((int) cell.getNumericCellValue());
                    }
                    else if (cellIndex == 4) {
                        if(cell.getCellType() == CellType.BOOLEAN){
                            data.setDeleted(cell.getBooleanCellValue());
                        }
                        else{
                            data.setDeleted(Boolean.parseBoolean(cell.getStringCellValue()));
                        }
                    }
                    else if (cellIndex == 5) {
                        String meanings = cell.getStringCellValue();
                        log.info("meanings: {}", meanings);
                        int lengthMeanings = meanings.length();
                        List<String> listMeanings = new ArrayList<>();
                        String meaning = "";
                        for(int i = 0; i < lengthMeanings; i++){
                            if(meanings.charAt(i) == ';'){
                                listMeanings.add(meaning);
                                meaning = "";
                                continue;
                            }
                            meaning += meanings.charAt(i);
                        }
                        listMeanings.add(meaning);
                        data.setMeanings(listMeanings);
                    }
                    cellIndex++;
                }
                listData.add(data);
            }
            return listData;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
