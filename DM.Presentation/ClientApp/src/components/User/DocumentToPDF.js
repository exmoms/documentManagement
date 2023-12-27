import React from "react";
import { Document, Page, StyleSheet, Image, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  image: {
    width: "100%",
    height: "100%",
    padding: 10,
    backgroundColor: "white",
  },
});

export default function DocumentToPDF(props) {
  return (
    <Document>
      {props.scans.map((element, index) => {
        return (
          <Page key={index} size="A4" style={styles.page}>
            <View style={styles.image}>
              <Image src={element} />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
