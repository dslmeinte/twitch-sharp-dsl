rm dist/* ||:
npx parcel build src/index.html
sed -i '' -e 's/="\/src/="file:\.\/src/g' dist/index.html
FOLDER_NAME=DataModelDsl
ZIP_NAME="${FOLDER_NAME}.zip"
mv dist $FOLDER_NAME
zip -r $ZIP_NAME $FOLDER_NAME/
mv $FOLDER_NAME dist
mv $ZIP_NAME dist/
