import React from "react";

function TokenList({ nftList }) {

    console.log("Children List", nftList)

    const listTokens = nftList.map((item, index) =>
        <li key={index}>{item}</li>
    );

    return (
        <>
            {
                nftList.length > 0 ? (
                    <div>
                        <h1>Token's List</h1>
                        <ul>{{ listTokens }}</ul>
                    </div>

                )
                : null
            }
        </>
    )
}
export default TokenList;