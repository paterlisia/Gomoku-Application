import "./board.css";
import React, { useState } from "react";
import { calculateWinner } from "./helper";

import { Divider, Button, notification, Modal, Select, Upload, message } from 'antd';

// service to call api
import ModelService from '../utils/ModelService';

// ui framework from antd
import { CheckOutlined, UndoOutlined } from '@ant-design/icons';
import { useEffect } from "react";
import Operation from "antd/lib/transfer/operation";

import 'antd/dist/antd.css';


// console output in the chrome
// import log from 'electron-log';
// service to call api


function UploadModel() {
    const re = /(?:\.([^.]+))?$/; // regression for match extension
    const [modelsList, setModelsList] = useState([]);
    const [loading, setLoading] = useState(false);
    // model1 and model2 hooks
    const [model1, setModel1] = useState('');
    const [model2, setModel2] = useState('');

    // upload message notification
    const success = () => {
        message.success('Successfully upload your models!');
    };

    const error = () => {
        message.error('Upload failed.');
    };

    const warning = () => {
        message.warning(
            'Invalid model, please upload file with exstension of pth or model'
        );
    };

    // handle upload models with setting hooks
    const handleUpload1 = (e) => {
        console.log(e.file.originFileObj);
        if (e.file.originFileObj !== null) {
            const ext = e.file.originFileObj.name.split('.').pop();
            console.log(ext);
            if (ext === 'pth' || ext === 'model') {
                setModel1(e.file.originFileObj.name);
            } else {
                warning();
            }
        }
    };

    const handleUpload2 = (e) => {
        console.log(e.file.originFileObj); console.log(e.file.originFileObj);
        if (e.file.originFileObj !== null) {
            const ext = e.file.originFileObj.name.split('.').pop();
            if (ext === 'pth' || ext === 'model') {
                setModel2(e.file.originFileObj.name);
            } else {
                warning();
            }
        }
    };

    // TODO: POST here
    const postModel = async (e) => {
        setLoading(true);
        // call API to post model url
        const service = new ModelService();
        const rsp = service.postmodel({ model1, model2 });
        console.log('upload Finished');

        rsp
            .then((response) => {
                console.log('res:', response);
                const { res } = response.data;
                console.log('res:', res);
                if (res === 'success') {
                    success();
                } else {
                    error();
                }
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div style={{ width: 256 }}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    Upload your model
                    <Upload onChange={handleUpload1}>
                        <Button>Select your model</Button>
                    </Upload>
                    <Upload onChange={handleUpload2}>
                        <Button>Select your model</Button>
                    </Upload>
                    <Button onClick={postModel}>Submit</Button>
                    <ul>
                        {modelsList.map((url, index) => {
                            return (
                                <li key={index}>
                                    <a href={url}>{url}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

//Square，一个渲染方法足够了，它只干一件事：根据上面传下来的props来决定渲染什么，怎么渲染，完全没必要再开一个扩展组件。
function Square(props: { onClick: React.MouseEventHandler<HTMLButtonElement> | undefined; value: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {//通过props传递数据
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
/*

Square：方块组件  Board：面板组件

问题：1.model在humanplay是怎么体现的 
getModelAction将动作传给model，然后model来预测

2，human下棋的步骤在哪里
过程：renderSquare==>handle click将玩家选择的位置传到getModelAction，然后getModelAction将人的选择传给模型，模型做出预测给出AI的move
读懂renderSquare：return里面的Square组件对应的是function Square:所以本质棋盘


3. modelService，对着后端的API将位置传给模型去预测了：在人机博弈中机器的模型是被写死的，但是机机博弈需要写一个函数来承接自由选择的模型

4.AI的结果是怎么显示到桌面上的？
newBoard[AI2y][AI2x] = "⚪";
setBoard(newBoard);
setWhiteIsNext(!whiteIsNext);
直接将结果写到board上了

*/
function Board() {
    const re = /(?:\.([^.]+))?$/; // regression for match extension
    const [modelsList, setModelsList] = useState([]);
    const [loading, setLoading] = useState(false);
    // model1 and model2 hooks
    const [model1, setModel1] = useState('');
    const [model2, setModel2] = useState('');

    // upload message notification
    const success = () => {
        message.success('Successfully upload your models!');
    };

    const error = () => {
        message.error('Upload failed.');
    };

    const warning = () => {
        message.warning(
            'Invalid model, please upload file with exstension of pth or model'
        );
    };

    // handle upload models with setting hooks
    const handleUpload1 = (e) => {
        console.log(e.file.originFileObj);
        if (e.file.originFileObj !== null) {
            const ext = e.file.originFileObj.name.split('.').pop();
            console.log(ext);
            if (ext === 'pth' || ext === 'model') {
                setModel1(e.file.originFileObj.name);
            } else {
                warning();
            }
        }
    };

    const handleUpload2 = (e) => {
        console.log(e.file.originFileObj); console.log(e.file.originFileObj);
        if (e.file.originFileObj !== null) {
            const ext = e.file.originFileObj.name.split('.').pop();
            if (ext === 'pth' || ext === 'model') {
                setModel2(e.file.originFileObj.name);
            } else {
                warning();
            }
        }
    };

    // TODO: POST here
    const postModel = async (e) => {
        setLoading(true);
        // call API to post model url
        const service = new ModelService();
        const rsp = service.postmodel({ model1, model2 });
        console.log('uploading...');

        rsp
            .then((response) => {
                console.log('res:', response);
                const { res } = response.data;
                console.log('res:', res);
                if (res === 'success') {
                    success();
                } else {
                    error();
                }
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const [board, setBoard] = useState(Array(8).fill(Array(8).fill(null)));
    const [available, setAvailable] = useState([]);
    const [historyStates, setHistoryStates] = useState({});
    const [lastMove, setLastMove] = useState(-1);
    const [whiteIsNext, setWhiteIsNext] = useState(true);
    const [winner, setWinner] = useState(false);
    const [isWinModalVisible, setIsWinModalVisible] = useState(false);
    const [isLoseModalVisible, setIsLoseModalVisible] = useState(false);
    const [mode, setMode] = useState(50);  // difficulty of the model



    const handleBoard1 = (AIy: number, AIx: number) => {
        console.log("in handleBoard1")
        console.log("AIy: ", AIy);
        console.log("AIx: ", AIx);
        const newBoard = JSON.parse(JSON.stringify(board));
        console.log("newBoard:", typeof newBoard);
        console.log("newboard:", newBoard); // latest board
        // human move update
        newBoard[AIy][AIx] = "⚫";
        // if AI wins
        // calculateWinner算是否赢了
        const AIWin = calculateWinner(
            AIy,
            AIx,
            newBoard,
            newBoard[AIy][AIx]
        )
        if (AIWin) {//|| newBoard[AIy][AIx] !== null /*cannot set duplicate*/) {
            setWinner(AIWin);
            // AIWinEvent();
            console.log("I am returning lalalalalalala")
            return;
        }

        // // AI move update

        // newBoard[AIy][AIx] = "⚪";

        setBoard(newBoard);
        console.log("old board:", board);
        console.log("new board:", newBoard);
        console.log("last move", newBoard[AIy][AIx]);
        console.log("player", typeof newBoard[1][1]);
        console.log("white?", whiteIsNext);
        setWhiteIsNext(!whiteIsNext);
    }


    const handleBoard2 = (AIy: number, AIx: number) => {
        console.log("in handleBoard2")
        console.log("AIy: ", AIy);
        console.log("AIx: ", AIx);
        const newBoard = JSON.parse(JSON.stringify(board));
        console.log("newBoard:", typeof newBoard);
        console.log("newboard:", newBoard); // latest board
        // human move update
        newBoard[AIy][AIx] = "⚪";
        // if AI wins
        // calculateWinner算是否赢了
        const AIWin = calculateWinner(
            AIy,
            AIx,
            newBoard,
            newBoard[AIy][AIx]
        )
        if (AIWin) {//|| newBoard[AIy][AIx] !== null /*cannot set duplicate*/) {
            setWinner(AIWin);
            // AIWinEvent();
            return;
        }


        setBoard(newBoard);
        console.log("old board:", board);
        console.log("new board:", newBoard);
        console.log("last move", newBoard[AIy][AIx]);
        console.log("player", typeof newBoard[1][1]);
        console.log("white?", whiteIsNext);
        setWhiteIsNext(!whiteIsNext);
    }


    // check the winner
    const ifEnd = (y: number, x: number) => {
        const newBoard = JSON.parse(JSON.stringify(board));
        console.log("newBoard:", typeof newBoard);
        console.log("newboard:", newBoard); // latest board
        // if human wins
        const win = calculateWinner(
            y,
            x,
            newBoard,
            newBoard[x][x]
        )
        console.log("Current win status", win);
        if (win ||
            newBoard[y][x] !== null // cannot set duplicate
        ) {
            console.log("in ifEnd's if");
            setWinner(win);
            return true;
        }
    }

    const handleClick1 = () => {
        startModelCompete();
    }

    const startModelCompete = async () => {//异步执行rsp1和rsp2
        console.log('in startModelCompete')
        const service = new ModelService();
        console.log(available);
        console.log("whiteIsNext", whiteIsNext);
        if (whiteIsNext) {
            console.log("for player1 now");
            console.log("history_states: ", historyStates);
            console.log("availables: ", available);
            console.log("last_move is: ", lastMove);
            const rsp1 = service.getAction1({
                history_states: historyStates,
                availables: available,
                last_move: lastMove,
                mode: mode //暂时先带着
            });
            //rsp1
            //  .then(
            //(response) => {

            const { history_states, availables, last_move, x, y, winner } = (await rsp1).data;

            console.log('history_states:', history_states);
            console.log('availables:', availables);
            console.log('last_move:', last_move);
            console.log('winner:', winner);
            if (winner == 2) {
                AIWinEvent();
                // return;
            } else if (winner == 1) {
                humanWinEvent();
                // return;
            }


            // set corresponding state in hooks
            console.log("for player1, before seting available, historyStates and last_move");
            setAvailable(availables);
            setHistoryStates(history_states);
            setLastMove(last_move);
            console.log('after_history_states:', history_states);
            console.log('after_availables:', availables);
            console.log('after_last_move:', last_move);
            console.log('after_winner:', winner);
            // AI move
            handleBoard1(y, x)
        } else {
            console.log("for player2 now");
            console.log("history_states: ", historyStates)
            console.log("last_move: ", lastMove)
            console.log("availables: ", available)
            const rsp2 = service.getAction2({
                history_states: historyStates,
                availables: available,
                last_move: lastMove,
                mode: mode //暂时先带着
            });
            // rsp2
            //     .then((response) => {
            //console.log('res:', response);
            const { history_states, availables, last_move, x, y, winner } = (await rsp2).data;

            console.log('history_states:', history_states);
            console.log('availables:', availables);
            console.log('last_move:', last_move);
            console.log('winner:', winner);


            // set corresponding state in hooks
            setAvailable(availables);
            setHistoryStates(history_states);
            setLastMove(last_move);
            console.log('after_history_states:', history_states);
            console.log('after_availables:', availables);
            console.log('after_last_move:', last_move);
            console.log('after_winner:', winner);
            // AI2 move
            handleBoard2(y, x)
        }

        //return response;
        // })
        // .catch((error) => {
        //     console.log(error);
        // })


        //     return response;
        // })
        // .catch((error) => {
        //     console.log(error);
        // });



    }




    // start play game
    const startPlay = () => {
        // call API to get model decision
        const service = new ModelService();
        const rsp = service.startPlay();
        console.log('waiting for AI to decide...');
        //暂时理解为将rsp的值赋给response
        rsp
            .then((response) => {
                const { availables, history_states, last_move } = response.data;
                console.log('availables:', availables);
                console.log('history_states:', history_states);
                console.log('last_move:', last_move);

                // set corresponding state in hooks
                setAvailable(availables);
                setHistoryStates(history_states);
                setLastMove(last_move);
                return response;
            })
            .catch((error) => {
                console.log(error);
            });
        startNotify();
    }

    // handle select
    function handleSelect(value: any) {
        console.log(`selected ${value}`);
        if (value == "easy") {
            setMode(2);
        } else if (value == "medium") {
            setMode(10);
        } else {
            setMode(100);
        }
    }

    // handle restart the game
    const handleRestart = () => {
        // reset the game board
        setBoard(Array(8).fill(Array(8).fill(null)));
        restartNotify();
        // sent start API to the backend
        startPlay();
    }

    // start notification
    const startNotify = () => {
        notification.open({
            message: 'Start the game',
            description:
                'The game starts and your AI model will be loading!',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }

    // restart notification
    const restartNotify = () => {
        notification.open({
            message: 'Restart the game',
            description:
                'The game board will be reset and your AI model will be reload...',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }


    // when human wins
    const humanWinEvent = () => {
        // message.success('You win the game!');
        setIsWinModalVisible(true);
    };

    // when human wins
    const AIWinEvent = () => {
        // message.error('You lose, can try again!');
        setIsLoseModalVisible(true);
    };

    function renderSquare(j: number, i: number) {
        return <Square value={board[j][i]} />;//Square是组件，传入的value为board[i][j]
    }

    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else {
        status = "Next player: " + (whiteIsNext ? "⚫" : "⚪");
    }

    return (
        <div className="board">
            {/* map() 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成 
        所以这里相当于是对board里面的每一个位置都做了renderSquare
      */}

            {board.map((y, columnIndex) => {
                return (
                    <div className="board-row" key={columnIndex}>
                        {board.map((x, rowIndex) => renderSquare(columnIndex, rowIndex))}
                    </div>
                );
            })}
            <Divider plain>Functions setting</Divider>
            <div className="status">
                <div>{status}</div>

                {/* <Select style={{ width: 140 }} placeholder="Select difficulty" onChange={handleSelect}>
                    <Option value="easy">easy</Option>
                    <Option value="medium">medium</Option>
                    <Option value="hard" >hard</Option>
                </Select> */}
                <Button
                    // type="primary"
                    shape="round"
                    icon={<CheckOutlined />}
                    size="large"
                    onClick={() => startPlay()}
                    color="#597ef7"
                >

                    Init Board
                </Button>

                <Button
                    // type="primary"
                    shape="round"
                    icon={<CheckOutlined />}
                    size="large"
                    onClick={() => handleClick1()}
                    color="#597ef7"
                >

                    Run AI
                </Button>


                <Button
                    // type="primary"
                    shape="round"
                    icon={<UndoOutlined />}
                    size="large"
                    onClick={handleRestart}
                >
                    Restart
                </Button>
                <Modal title="Congratulations!" visible={isWinModalVisible} onOk={() => setIsWinModalVisible(false)} onCancel={() => setIsWinModalVisible(false)}>
                    <p>You win the game !!!</p>
                    <p>You can try a harder mode if you want :)</p>
                </Modal>
                <Modal title="Sorry..." visible={isLoseModalVisible} onOk={() => setIsLoseModalVisible(false)} onCancel={() => setIsLoseModalVisible(false)}>
                    <p>You lose the game...</p>
                    <p>You can try again~</p>
                </Modal>
            </div>
            <div style={{ width: 256 }}>
            {loading ? (
                <div>Load Finish!.</div>
            ) : (   
                <div>
                    Upload your model
                    <Upload onChange={handleUpload1}>
                        <Button>Select your model for ⚫ </Button>
                    </Upload>
                    <Upload onChange={handleUpload2}>
                        <Button>Select your model for ⚪</Button>
                    </Upload>
                    <Button onClick={postModel}>Submit</Button>
                    <ul>
                        {modelsList.map((url, index) => {
                            return (
                                <li key={index}>
                                    <a href={url}>{url}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
        </div>
    );
}

function ModelCompete1() {

    return (
        <div className="gameBoard">
            <h1>Gomoku</h1>
            <Board />
        </div>
    );
}

export default ModelCompete1;
