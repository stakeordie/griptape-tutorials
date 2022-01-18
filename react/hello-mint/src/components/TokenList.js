import React from "react";

function TokenList({ nftList }) {

    function mapTokens() {
        return nftList.map(item => {
            return (
                <div>
                    <div>{item.name}</div>
                    <div>{item.description}</div>
                    <div>{item.image}</div>
                </div>
            );
        });
    }

    return (
        <>
            {mapTokens()}
        </>
    )
}
export default TokenList;
