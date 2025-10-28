function status(request, response) {
  response.status(200).json({ message: "Respondendo" });
}

export default status;
