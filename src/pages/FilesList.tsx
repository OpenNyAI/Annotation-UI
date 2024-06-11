import { Grid } from "@mui/material";
import { FileInfoItem } from "../components/FileInfoItem";

export const FilesList = () => {
  return (
    <Grid container columnSpacing={4} sx={{ padding: "24px" }} rowSpacing={4}>
      {new Array(10).fill(10).map((_, index) => {
        return (
          <Grid item md={6} xs={12} key={index}>
            <FileInfoItem />
          </Grid>
        );
      })}
    </Grid>
  );
};
