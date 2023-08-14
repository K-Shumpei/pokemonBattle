if ( true ) {

  const array = []
  for ( const item of itemAPIdata ) {
    array.push( item.nameJA )
  }

  const collator = new Intl.Collator("ja");
  array.sort(collator.compare);

  for ( const item of array ) {
    console.log("'" + item + "',")
  }
}
