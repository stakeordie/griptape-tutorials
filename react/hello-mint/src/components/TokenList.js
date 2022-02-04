import React from "react";

function TokenList({ nftList }) {

    function mapTokens() {
        return nftList.map((item,key) => {
            return (
                <div key={key}>
                    <div>{item.image ? <img src={item.image} alt={item.image}></img> : <img src="https://i.picsum.photos/id/551/200/300.jpg?hmac=pXJCWIikY_BiqwhtawBb8x1jxclDny0522ZprZVTJiU" alt="default"></img>}</div>
                    <div>{item.name}</div>
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
